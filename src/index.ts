import { HttpFunction } from '@google-cloud/functions-framework';

export const myFunctionName: HttpFunction = (request, response) => {
  response.status(200).send('Hello World!');
}