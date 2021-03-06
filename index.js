const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server,{
    cors:{
        origin: "*",
        methods: ["GET","POST"]
    }
});
app.use(cors());

const PORT = process.env.PORT || 5000;
app.get("/",(req,res) =>{
    res.send('Server is Running');
});
io.on('connection',(socket) => {
    socket.emit('me',socket.id);

    socket.on('disconnect', ()=> {
        socket.broadcast.emit("callEnded");
    });
     
    socket.on("callUser",({ userToCall,signalData,from,name})=>{
        io.to(userToCall).emit("callUser",{signal: signalData,from,name});
    });
    socket.on("AnswerCall",(data)=>{
       io.to(data.to).emit("callAccepted",data.signal);
    });
});


app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(PORT, () => console.log(`Server listening on the port ${PORT}`));


