import * as uuid from 'uuid';
jest.mock('uuid');

let uuidCounter = 1;

jest.spyOn(uuid, 'v4').mockImplementation(() => (uuidCounter++).toString());
