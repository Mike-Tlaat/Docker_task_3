const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/attendance_project')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const attendanceSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  present: { type: Boolean, default: true }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

app.post('/api/attendance', async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/attendance/absent/:id', async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'الطالب غير موجود' });

    record.present = false;
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
