const Subtask = require('../models/subtasksmodel');
const Reminder = require('../models/remindermodel');

const addSubtask = async (req, res) => {
    const { mtid, title, description, startdate, expiredate, priority, tags } = req.body;

    try {
        const newSubtask = new Subtask({
            mtid,
            title,
            description,
            startdate,
            expiredate,
            priority,
            tags
        });

        await newSubtask.save();

        return res.status(201).json({ message: "Subtask added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const updateSubtask = async (req, res) => {
    const { title, description, startdate, expiredate, priority, completed, tags } = req.body;
    const { _id } = req.params;

    try {
        await Subtask.findByIdAndUpdate(
            _id,
            {
                title,
                description,
                startdate,
                expiredate,
                priority,
                tags,
            }
        );

        return res.status(200).json({ message: "Subtask updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const deleteSubtask = async (req, res) => {
    const { _id } = req.params;

    try {
        await Reminder.deleteMany({ tid: _id });
        await Subtask.findByIdAndDelete(_id);

        return res.status(200).json({ message: "Subtask deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const readSubtask = async (req, res) => {
    try {
        const subtask = await Subtask.find();
        return res.status(200).json({ data: subtask });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addSubtask,
    updateSubtask,
    deleteSubtask,
    readSubtask,
}