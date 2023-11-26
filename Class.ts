export default class Hotel {
    public floor: number
    public roomEachFloor: number
    public rooms: number[]
    public booking: Booking[]

    constructor(floor: number, numberOfRoomEachFloor: number) {
        this.rooms = []
        this.booking = []
        this.floor = floor
        this.roomEachFloor = numberOfRoomEachFloor
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

    public createBooking(roomNumber: number, guestName: string, guestAge: number) {
        const newBooking = new Booking(this, roomNumber, guestName, guestAge)
        if (newBooking.bookingId) {
            this.booking.push(newBooking)
            console.log(`Room ${roomNumber} is booked by ${guestName} with keycard number ${newBooking.keyCardNumber}.`)
            return newBooking
        }
    }

    public createBookingByFloor(floor: number, guestName: string, guestAge: number) {
        const listOfFloor = this.rooms.filter((room) => room.
            toString()
            .slice(0, floor.toString().length) === floor.toString())
        const allAvailableRoom = this.getAllAvailableRoom()
        const availableRoomByFloor = allAvailableRoom.filter((roomNumber) => listOfFloor.includes(roomNumber))
        if (availableRoomByFloor.length === this.roomEachFloor) {
            const newBookingList = availableRoomByFloor
                .map((roomNumber) => {
                    const newBooking = new Booking(this, roomNumber, guestName, guestAge)
                    if (newBooking.bookingId) {
                        this.booking.push(newBooking)
                    }
                    return newBooking
                })
                .filter((booking) => booking.bookingId)
            console.log(`Room ${newBookingList.map((booking) => booking!.roomNumber).join(', ')} is booked with keycard number ${newBookingList.map((booking) => booking!.keyCardNumber).join(', ')}.`)
        } else {
            console.log(`Cannot book floor ${floor} for ${guestName}.`)
        }
    }

    public getAllAvailableRoom() {
        const bookedRoom = this.booking
            .filter((booking) => booking.status === 'checkIn')
            .map((booking) => booking.roomNumber)
        const availableRooms = this.rooms.filter((roomNumber) => !bookedRoom.includes(roomNumber))
        return availableRooms
    }

    public getAllListOfGuest() {
        const listOfGuest = this.booking
            .filter((booking) => booking.status === 'checkIn')
            .map((booking) => booking.guestName)
        return listOfGuest
    }

    public getListOfGuestByAge(operator: string, age: number) {
        const checkedInBookingList = this.booking
            .filter((booking) => booking.status === 'checkIn')
        switch (operator) {
            case '<': {
                const guestNames = checkedInBookingList
                    .filter((booking) => booking.guestAge < age)
                    .map((booking) => booking.guestName)
                return guestNames
            }
            case '>': {
                const guestNames = checkedInBookingList
                    .filter((booking) => booking.guestAge > age)
                    .map((booking) => booking.guestName)
                return guestNames
            }

            default: return 'Operator not found.'
        }
    }

    public getGuestByFloor(floor: number) {
        const listOfFloor = this.rooms.filter((room) => room.
            toString()
            .slice(0, floor.toString().length) === floor.toString())
        const checkedInBookingList = this.booking.filter((booking) => booking.status === 'checkIn')
        const listOfRoomNumberWithSameFloor = checkedInBookingList.filter((booking) => listOfFloor.includes(booking.roomNumber))

        const guestNames = listOfRoomNumberWithSameFloor.map((booking) => booking.guestName)
        return guestNames
    }

    public getGuestNameByRoomNumber(roomNumber: number) {
        const targetBooking = this.booking
            .filter((booking) => booking.status === 'checkIn')
            .find((booking) => booking.roomNumber === roomNumber)
        if (targetBooking) {
            const guestName = targetBooking.guestName
            return guestName
        }
        return 'Room not found.'
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

class Booking {
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
