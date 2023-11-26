import Hotel from "./Class"
const fs = require('fs')

class Command {
  public name: string
  public params: (string | number)[]
  constructor(name: string, params: (string | number)[]) {
    this.name = name
    this.params = params
  }
}

function main() {
  const filename = 'input.txt'
  const commands = getCommandsFromFileName(filename)
  let hotel1: Hotel

  commands.forEach(command => {
    switch (command.name) {
      case 'create_hotel': {
        const [floor, roomPerFloor] = command.params
        hotel1 = new Hotel(Number(floor), Number(roomPerFloor))
        return
      }
      case 'book': {
        const [roomNumber, guestName, guestAge] = command.params
        hotel1.createBooking(Number(roomNumber), String(guestName), Number(guestAge))
        return
      }
      case 'list_available_rooms': {
        const listOfAvailableRooms = hotel1.getAllAvailableRoom()
        console.log(listOfAvailableRooms)
        return
      }
      case 'checkout': {
        const [keyCardNumber, guestName] = command.params
        hotel1.checkout(Number(keyCardNumber), String(guestName))
        return
      }
      case 'list_guest': {
        const listOfGuestName = hotel1.getAllListOfGuest()
        console.log(listOfGuestName)
        return
      }
      case 'get_guest_in_room': {
        const [roomNumber] = command.params
        const guestName = hotel1.getGuestNameByRoomNumber(Number(roomNumber))
        console.log(guestName)
        return
      }
      case 'list_guest_by_age': {
        const [operator, age] = command.params
        const listOfGuestName = hotel1.getListOfGuestByAge(String(operator), Number(age))
        console.log(listOfGuestName)
        return
      }
      case 'list_guest_by_floor': {
        const [floor] = command.params
        const listOfGuestNameByFloor = hotel1.getGuestByFloor(Number(floor))
        console.log(listOfGuestNameByFloor)
        return
      }
      case 'checkout_guest_by_floor': {
        const [floor] = command.params
        hotel1.checkoutByFloor(Number(floor))
        return
      }
      case 'book_by_floor': {
        const [floor, guestName, guestAge] = command.params
        hotel1.createBookingByFloor(Number(floor), String(guestName), Number(guestAge))
        return
      }
      default:
        return
    }
  })
}

function getCommandsFromFileName(fileName: string): Command[] {
  const file = fs.readFileSync(fileName, 'utf-8')

  return file
    .split('\n')
    .map((line: string) => line.split(' '))
    .map(
      ([commandName, ...params]: string[]) =>
        new Command(
          commandName,
          params.map(param => {
            const parsedParam = parseInt(param, 10)

            return Number.isNaN(parsedParam) ? param : parsedParam
          })
        )
    )
}

main()
