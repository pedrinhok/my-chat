(function () {

  angular
    .module("app", [])
    .controller("app.controller", function ($scope) {
      const vm = this

      vm.auth = () => {
        vm.params = ""
        vm.connected = true
        vm.user = { id: Math.round((Math.random() * 100)), name: vm.username }
        vm.rooms = [1, 2, 3]
        connect()
      }

      vm.switchroom = (room) => {
        vm.room = room
        vm.messages = []
        vm.socket.emit("switchroom", room)
      }

      vm.sendmessage = () => {
        vm.socket.emit("sendmessage", vm.message)
        vm.message = ""
      }

      vm.currentroom = (room) => vm.room === room ? "active" : ""

      const connect = () => {
        vm.socket = io.connect("http://127.0.0.1:8080/chat", {
          query: {
            user: vm.user
          }
        })
        vm.socket.on("connect", () => console.log("connected!"))
        vm.socket.on("disconnect", () => console.log("disconnected!"))
        vm.socket.on("refresh", refresh)
      }

      const refresh = (message) => {
        $scope.$apply(() => vm.messages.push(message))
      }

    })

})()
