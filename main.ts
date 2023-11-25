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

  commands.forEach(command => {
    switch (command.name) {
      case 'create_hotel':
        const [floor, roomPerFloor] = command.params
        const hotel = { floor, roomPerFloor }

        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        )
        return
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
