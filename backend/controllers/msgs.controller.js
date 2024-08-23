import Conversation from "../models/chat.model.js";

// add msg to the conversation where participants are the sender and receiver
export const addMsgToConversation = async(participants,msg)=> {
    try {
        // Find conversation by participants
        let conversation = await Conversation.findOne(
                                    { users: { $all: participants } });
 
 
        // If conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = await Conversation.create({ users: participants });
        }
        // Add msg to the conversation
          conversation.msgs.push(msg); // In every conversation we have array of msgs
          await conversation.save();
    } catch(error)
    {
        console.log('Error adding message to conversation: ' + error.message);
    }
};

const getMsgsForConversation = async (req, res) => {
    try {
        const { sender, receiver } = req.query;
        console.log(sender + receiver);
        const participants = [sender, receiver];
        // Find conversation by participants
        const conversation = await Conversation.findOne({ users: { $all: participants } });
        if (!conversation) {
            console.log('Conversation not found');
            return res.status(200).send();
        }
        return res.json(conversation.msgs);
    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
 };
 export default getMsgsForConversation;
 