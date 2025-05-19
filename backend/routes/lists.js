const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parse } = require('csv-parse');
const fs = require('fs');
const Agent = require('../models/Agent');
const List = require('../models/List');
const ListGroup = require('../models/ListGroup');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

// Validate phone number format
const validatePhone = (phone) => /^\d{10}$/.test(phone);

// Upload and distribute CSV
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const validExtensions = ['.csv', '.xlsx', '.xls'];
  const fileExt = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
  if (!validExtensions.includes(fileExt)) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ message: 'Invalid file type. Only CSV, XLSX, XLS allowed' });
  }

  if (fileExt !== '.csv') {
    fs.unlinkSync(file.path);
    return res.status(400).json({ message: 'Only CSV files are supported for now' });
  }

  const records = [];
  fs.createReadStream(file.path)
    .pipe(parse({ columns: true, trim: true }))
    .on('data', (row) => {
      if (row.firstName && validatePhone(row.phone)) {
        records.push(row);
      }
    })
    .on('end', async () => {
      fs.unlinkSync(file.path);
      try {
        const agents = await Agent.find({ createdBy: req.user.id });
        if (agents.length !== 5) {
          return res.status(400).json({ message: 'Exactly 5 agents required' });
        }

        // Check for duplicate ListGroup
        const existingListGroup = await ListGroup.findOne({ name: file.originalname, createdBy: req.user.id });
        if (existingListGroup) {
          return res.status(400).json({ message: 'Already have these details list' });
        }

        // Create a new ListGroup for this upload
        const listGroup = new ListGroup({
          name: file.originalname,
          createdBy: req.user.id,
        });
        await listGroup.save();

        const itemsPerAgent = Math.floor(records.length / 5);
        const remainder = records.length % 5;
        const distributedLists = [];

        for (let i = 0; i < records.length; i++) {
          let agentIndex;
          if (i < itemsPerAgent * 5) {
            agentIndex = Math.floor(i / itemsPerAgent);
          } else {
            agentIndex = i - itemsPerAgent * 5;
          }
          if (agentIndex >= 5) {
            agentIndex = agentIndex % 5;
          }
          const list = new List({
            firstName: records[i].firstName,
            phone: records[i].phone,
            notes: records[i].notes || '',
            agent: agents[agentIndex]._id,
            createdBy: req.user.id,
            listGroup: listGroup._id,
          });
          await list.save();
          distributedLists.push(list);
        }

        res.json({ message: 'File uploaded and lists distributed', listGroup, lists: distributedLists });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
    })
    .on('error', () => {
      fs.unlinkSync(file.path);
      res.status(400).json({ message: 'Invalid CSV format' });
    });
});

// Get all distributed lists
router.get('/', authMiddleware, async (req, res) => {
  try {
    const lists = await List.find({ createdBy: req.user.id }).populate('agent', 'name email');
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/group/:name', authMiddleware, async (req, res) => {
  try {
    const listGroup = await ListGroup.findOne({ name: req.params.name, createdBy: req.user.id });
    if (!listGroup) {
      return res.status(404).json({ message: 'List group not found' });
    }
    const lists = await List.find({ listGroup: listGroup._id }).populate('agent', 'name email');
    res.json({ listGroup, lists });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
