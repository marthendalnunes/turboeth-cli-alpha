import {Command, ux} from '@oclif/core'
import chalk from 'chalk'
import select from '@inquirer/select'
import input from '@inquirer/input'
import fs from 'fs-extra'
import path from 'node:path'
import degit from 'degit'

export const templateChoices = [
  {
    name: 'TurboETH Light',
    description: 'Lightweight template for building decentralized applications with TurboETH.',
    value: 'turbo-eth/template-web3-app',
  },
  {
    name: 'TurboETH Integrations',
    description: 'A robust template with several integrations for building decentralized applications with TurboETH.',
    value: 'turbo-eth/template-web3-app#integrations',
  },
  {
    name: 'Networks',
    description: 'A template for social networks and personalized experiences using decentralized identity with Disco.',
    value: 'turbo-eth/template-disco-app',
  },
  {
    name: 'Council',
    description: 'A template for decentralized autonomous organization goveranance and artificial intelligence experiments.',
    value: 'turbo-eth/template-tally-app',
  },

]

interface CliResults {
  appName: string;
}

const defaultValues : CliResults = {
  appName: 'my-app',
}

export default class Core extends Command {
  async run(): Promise<void> {
    const projectName = await input({
      message: 'What will be the name of your project?',
      default: defaultValues.appName,
      transformer: (input: string) => {
        return input.trim()
      },
    })

    const templateMode: string = await select({
      message: 'Which template would you like to use?',
      choices: templateChoices.map(({name, description, value}) => ({
        name,
        value,
        description,
      })),
    })

    ux.action.start(`${chalk.blue(`Scaffolding ${chalk.bold(projectName)}`)}`)
    const projectDir = path.resolve(process.cwd(), projectName)
    const emitter = degit(templateMode, {
      verbose: true,
    })

    fs.mkdirSync(projectDir)

    await emitter.clone(projectDir)
    ux.action.stop(`${chalk.green(`Sucessfully created ${chalk.bold(projectName)}!`)}`)
  }
}
