
const express=require('express');
const app=express();
const dotenv=require('dotenv');
const cors=require('cors');
const connectDatabase=require('./controllers/connectDatabase');
dotenv.config();

const prompt=require('./routes/prompts');
const userprompts=require('./routes/userprompts');
const singlePrompts=require('./routes/prompts');
const response=require('./routes/userprompts');
const deletePrompt=require('./routes/prompts');
connectDatabase();

app.use(cors());
app.use(express.json());
app.use('/api/v1/',prompt);
app.use('/api/v1/',userprompts);
app.use('/api/v1/',response);
app.use('/api/v1/',singlePrompts);
app.use('/api/v1/',deletePrompt);


app.listen(process.env.PORT,()=>{
    console.log("Server Listening the port ",process.env.PORT);
});