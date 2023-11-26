export class Hotel {
    public rooms: number[]
    public booking: Booking[]

    constructor(floor: number, numberOfRoomEachFloor: number) {
        this.rooms = []
        this.booking = []
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
        if (this.rooms.length) {
            console.log(
                `Hotel created with ${floor} floor(s), ${numberOfRoomEachFloor} room(s) per floor.`
            )
        }
    }

    public getAllAvailableRoom() {
        const bookedRoom = this.booking
            .filter((booking) => booking.status === 'checkIn')
            .map((booking) => booking.roomNumber)
        return this.rooms.filter((roomNumber) => !bookedRoom.includes(roomNumber))
    }

    public getAllListOfGuest() {
        return this.booking.filter((booking) => booking.status === 'checkIn').map((booking) => booking.guestName)
    }

    public getListOfGuestByAge(operator: string, age: number) {
        const checkedInBookingList = this.booking.filter((booking) => booking.status === 'checkIn')
        switch (operator) {
            case '<': return checkedInBookingList.filter((booking) => booking.guestAge < age).map((booking) => booking.guestName)
            case '>': return checkedInBookingList.filter((booking) => booking.guestAge > age).map((booking) => booking.guestName)

            default: return 'Operator not found.'
        }
    }

    public getGuestByFloor(floor: number) {
        const listOfFloor = this.rooms.filter((room) => room.
            toString()
            .slice(0, floor.toString().length) === floor.toString())
        const checkedInBookingList = this.booking.filter((booking) => booking.status === 'checkIn')
        const listOfRoomNumberWithSameFloor = checkedInBookingList.filter((booking) => listOfFloor.includes(booking.roomNumber))

        return listOfRoomNumberWithSameFloor.map((booking) => booking.guestName)

    }

    public getGuestNameByRoomNumber(roomNumber: number) {
        const targetBooking = this.booking
            .filter((booking) => booking.status === 'checkIn')
            .find((booking) => booking.roomNumber === roomNumber)
        if (targetBooking) {
            return targetBooking.guestName
        }
        return 'Room not found.'
    }

    public createBooking(roomNumber: number, guestName: string, guestAge: number) {
        const newBooking = new Booking(this, roomNumber, guestName, guestAge)
        if (newBooking.bookingId) {
            this.booking.push(newBooking)
        }
    }

    public checkoutByFloor(floor: number) {
        const listOfFloor = this.rooms.filter((room) => room.
            toString()
            .slice(0, floor.toString().length) === floor.toString())
        const allCheckedInBooking = this.booking.filter((booking) => booking.status === 'checkIn')
        const listOfBookingByFloor = allCheckedInBooking.filter((booking) => listOfFloor.includes(booking.roomNumber))
        listOfBookingByFloor.forEach((booking) => {
            const bookingIndex = this.booking.findIndex((sourceBooking) => sourceBooking.bookingId === booking.bookingId)
            if (bookingIndex) {
                this.booking[bookingIndex].status = 'checkOut'
            }
        })

        console.log(`Room ${listOfBookingByFloor.map((booking) => booking.roomNumber).join(', ')} are checkout.`)
    }

    public checkout(keyCardNumber: number, guestName: string) {
        const checkedInBookingInfoByKeyCardNumber = this.booking
            .filter((booking) => booking.status === 'checkIn')
            .find((booking) => booking.keyCardNumber === keyCardNumber)

        if (checkedInBookingInfoByKeyCardNumber) {
            if (checkedInBookingInfoByKeyCardNumber.guestName === guestName) {
                const targetBookingIndex = this.booking.findIndex((booking) => booking.bookingId === checkedInBookingInfoByKeyCardNumber.bookingId)
                if (targetBookingIndex >= 0) {
                    const targetBooking = this.booking[targetBookingIndex]
                    targetBooking.status = 'checkOut'
                    console.log(`Room ${targetBooking.roomNumber} is checkout.`)
                    return;
                }
            }
            console.log(`Only ${checkedInBookingInfoByKeyCardNumber.guestName} can checkout with keycard number ${checkedInBookingInfoByKeyCardNumber.keyCardNumber}.`)
            return;
        }
        console.log('Room not found.')
    }

}

export class Booking {
    public bookingId: number
    public roomNumber: number
    public guestName: string
    public guestAge: number
    public keyCardNumber: number
    public status: 'checkIn' | 'checkOut'

    constructor(hotel: Hotel, roomNumber: number, guestName: string, guestAge: number) {
        this.bookingId = 0
        this.roomNumber = 0
        this.guestName = ''
        this.guestAge = 0
        this.keyCardNumber = 0
        this.status = 'checkOut'
        this.createBooking(hotel, roomNumber, guestName, guestAge)
    }

    private createBooking(hotel: Hotel, roomNumber: number, guestName: string, guestAge: number) {
        const newBookingId = this.getNewBookingId(hotel, roomNumber, guestName)
        if (newBookingId) {
            this.bookingId = newBookingId
            this.roomNumber = roomNumber
            this.guestName = guestName
            this.guestAge = guestAge
            this.keyCardNumber = this.getKeyCardNumber(hotel)
            this.status = 'checkIn'
            console.log(`Room ${this.roomNumber} is booked by ${this.guestName} with keycard number ${this.keyCardNumber}.`)
        }
    }

    private getNewBookingId(hotel: Hotel, newRoomNumber: number, newGuestName: string): number | null {
        const checkedInBooking = hotel.booking.filter((booking) => booking.status === 'checkIn')
        const bookedInfoByRoomNumber = checkedInBooking.find((booking) => booking.roomNumber === newRoomNumber)
        if (bookedInfoByRoomNumber) {
            console.log(`Cannot book room ${newRoomNumber} for ${newGuestName},The room is currently booked by ${bookedInfoByRoomNumber.guestName}.`)
            return null
        }
        return hotel.booking.length + 1
    }

    private getKeyCardNumber(hotel: Hotel): number {
        const allKeyCardNumber = hotel.rooms.map((_roomNumber, index) => index + 1)
        const usedKeyCardNumber = hotel.booking
            .filter((booking) => booking.status === 'checkIn')
            .map((booking) => booking.keyCardNumber)
        const newKeyCardNumber = allKeyCardNumber.filter((keyCardNumber) => !usedKeyCardNumber.includes(keyCardNumber))
        return newKeyCardNumber[0]
    }

}

const hotel1 = new Hotel(2, 3)
console.log(hotel1.rooms)
hotel1.createBooking(203, 'Thor', 32)
hotel1.createBooking(101, 'PeterParker', 16)
hotel1.createBooking(102, 'StephenStrange', 36)
hotel1.createBooking(201, 'TonyStark', 48)
hotel1.createBooking(202, 'TonyStark', 48)
hotel1.createBooking(203, 'TonyStark', 48)
console.log(hotel1.getAllAvailableRoom())
hotel1.checkout(4, 'TonyStark')
hotel1.createBooking(103, 'TonyStark', 48)
hotel1.createBooking(101, 'Thanos', 65)
hotel1.checkout(1, 'TonyStark')
hotel1.checkout(5, 'TonyStark')
hotel1.checkout(4, 'TonyStark')
console.log(hotel1.getAllListOfGuest())
console.log(hotel1.getGuestNameByRoomNumber(203))
console.log(hotel1.getListOfGuestByAge("<", 18))
console.log(hotel1.getGuestByFloor(2))
hotel1.checkoutByFloor(1)
// console.log(hotel1.booking)
