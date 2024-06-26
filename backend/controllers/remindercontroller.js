const Reminder = require('../models/reminder');

const addReminder = async (req, res) => {
    const { uid,tid, date, time, message, count } = req.body;

    try {
        const newReminder = new Reminder({
            tid,
            uid,
            date,
            message,
            time,
            count
        });

        await newReminder.save();

        return res.status(201).json({ message: "Reminder added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const updateReminder = async (req, res) => {
    const { date ,time , message } = req.body;
    const { _id } = req.params;

    try {
        await Reminder.findByIdAndUpdate(
            _id,
            {
                date,
                time,
                message
            }
        );

        return res.status(200).json({ message: "Reminder updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const deleteReminder = async (req, res) => {
    const { _id } = req.params;

    try {
        await Reminder.findByIdAndDelete(_id);

        return res.status(200).json({ message: "Reminder deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const readReminder = async (req, res) => {
    try {
        const remiders = await Reminder.find();
        return res.status(200).json({ data: remiders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addReminder,
    updateReminder,
    deleteReminder,
    readReminder,
}