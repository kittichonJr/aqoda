export class Hotel {
    public rooms: number[] = []

    constructor(floor: number, numberOfRoomEachFloor: number) {
        this.createRooms(floor, numberOfRoomEachFloor)
    }

    private createRooms(floor: number, numberOfRoomEachFloor: number) {
        for (let level = 1; level <= floor; level++) {
            for (let roomNumber = 1; roomNumber <= numberOfRoomEachFloor; roomNumber++) {
                const formattedRoomNumber = roomNumber < 10 ? `0${roomNumber}` : roomNumber
                const newRoomNumber = `${level}${formattedRoomNumber}`
                this.rooms.push(Number(newRoomNumber))
            }
        }
    }

}

const hotel1 = new Hotel(2, 3)
console.log(hotel1.rooms)