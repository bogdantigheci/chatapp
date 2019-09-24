class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chatapp = db.collection("chatapp");
    this.unsub;
  }
  async addChat(message) {
    const now = new Date();
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    };
    const response = await this.chatapp.add(chat);
    return response;
  }
  getChatapp(callback) {
    this.unsub = this.chatapp
      .where("room", "==", this.room)
      .orderBy("created_at")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            callback(change.doc.data());
          }
        });
      });
  }
  updateName(username) {
    this.username = username;
    localStorage.setItem("username", username);
  }
  updateRoom(room) {
    this.room = room;
    console.log("room updated");
    if (this.unsub) {
      this.unsub();
    }
  }
}

// setTimeout(() => {
//   chatroom.updateRoom("gaming");
//   chatroom.getChatapp(data => {
//     console.log(data);
//   });
//   chatroom.addChat("hello");
// }, 3000);
