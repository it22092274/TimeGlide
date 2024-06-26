const Board = require('../models/boardmodel');
const Task = require('../models/taskmodel');
const Subtask = require('../models/subtasksmodel');
const Reminder = require('../models/remindermodel');
const Defaultboard = require('../models/defaultboardmodel');
const User = require('../models/usermodel');

const create = async (req, res) => {
    const { uid, themeid, name, description, startdate, expiredate, displaycolor } = req.body;

    try {
        const existingBoard = await Board.findOne({ uid, name });
        if (existingBoard) {
            return res.status(401).json({ message: "Board already exists" });
        }

        const newBoard = new Board({
            uid,
            themeid,
            name,
            description,
            startdate,
            expiredate,
            displaycolor
        });

        await newBoard.save();

        return res.status(201).json({ message: "Board created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const read = async (req, res) => {
    try {
        const boards = await Board.find();
        return res.status(200).json({ data: boards });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const edit = async (req, res) => {
    const { themeid, name, description, expiredate, displaycolor } = req.body;
    const { _id } = req.params;

    try {
        await Board.findByIdAndUpdate(
            _id,
            {
                themeid,
                name,
                description,
                expiredate,
                displaycolor
            }
        );

        return res.status(200).json({ message: "Update successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const deletes = async (req, res) => {
    const { _id } = req.params;
    const { completed, uid } = req.body;

    try {
        const tasks = await Task.find({ bid: _id });

        if (completed) {
            const subtaskIds = [];
            for (const task of tasks) {
                const subtasks = await Subtask.find({ tasksId: task._id });
                subtasks.forEach(subtask => subtaskIds.push(subtask._id));
            }

            const taskIds = tasks.map(task => task._id);
            const allIds = [...taskIds, ...subtaskIds];

            await Reminder.deleteMany({ tid: { $in: allIds } });
            await Subtask.deleteMany({ taskId: { $in: taskIds } });
            await Task.deleteMany({ bid: _id });
            await Board.findByIdAndDelete(_id);

            return res.status(201).json({ message: "Board and all associated tasks deleted successfully" });
        } else {
            const defaultBoard = await Defaultboard.findOne({ uid: uid });

            if (!defaultBoard) {
                return res.status(404).json({ message: "Default board not found" });
            }

            const defaultBoardId = defaultBoard._id;

            await Task.updateMany(
                { bid: _id },
                {
                    bid: defaultBoardId
                }
            );

            await Board.findByIdAndDelete(_id);

            return res.status(201).json({ message: "Board deleted, tasks moved to default board" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { create, read, edit, deletes };
