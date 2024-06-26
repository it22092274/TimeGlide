const Task = require('../models/taskmodel');
const Subtask = require('../models/subtasksmodel');
const Reminder = require('../models/remindermodel');

const addTask = async (req, res) => {
    const { bid, title, description, startdate, expiredate, priority, tags } = req.body;

    try {
        const newTask = new Task({
            bid,
            title,
            description,
            startdate,
            expiredate,
            priority,
            tags,
        });

        await newTask.save();

        return res.status(201).json({ message: "Task added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const updateTask = async (req, res) => {
    const { name, description, startdate, expiredate, priority,tags,completed } = req.body;
    const { _id } = req.params;

    try {
        await Task.findByIdAndUpdate(
            _id,
            {
                name,
                description,
                startdate,
                expiredate,
                priority,
                tags,
                completed,
            }
        );

        return res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const deleteTask = async (req, res) => {
    const { _id } = req.params;

    try {
        const subtasks = await Subtask.find({ taskId: _id });
        const subtaskIds = subtasks.map(subtask => subtask._id);

        await Reminder.deleteMany({ tid: { $in: [_id, ...subtaskIds] } });
        await Subtask.deleteMany({ mtid: _id });
        await Task.findByIdAndDelete(_id);

        return res.status(200).json({ message: "Task and associated subtasks deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const readTask = async (req, res) => {
    try {
        const task = await Task.find();
        return res.status(200).json({ data: task });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    addTask,
    updateTask,
    deleteTask,
    readTask,
}