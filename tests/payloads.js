module.exports = {
  register1: {
    username: 'michael',
    email: 'michael@mail.com',
    password: '12345678',
    location: {
      latitude: 40.4167,
      longitude: -3.70325
    },
    language: 'es'
  },
  register2: {
    username: 'john',
    email: 'john@mail.com',
    password: 'abcd1234',
    location: {
      latitude: 20.4167,
      longitude: -3.70325
    },
    language: 'es'
  },
  register3: {
    username: 'vicente',
    email: 'vicente@mail.com',
    password: '12345678',
    location: {
      latitude: -40.4167,
      longitude: -3.70325
    },
    language: 'en'
  },
  registerIncorrect: {
    username: '',
    email: ''
  },
  login1: {
    username: 'michael',
    password: '12345678'
  },
  login2: {
    username: 'nonExistingUser',
    password: '12345678'
  },
  login3: {
    username: 'michael',
    password: '123456'
  },
  login4: {
    username: 'michael',
    password: 'newPassword'
  },
  login5: {
    username: 'john',
    password: 'abcd1234'
  },
  modifyUser1: {
    email: 'newmichael@mail.com',
    language: 'en'
  },
  modifyUser2: {
    password: 'newPassword'
  },
  modifyUserIncorrect1: {
    password: '123'
  },
  modifyUserIncorrect2: {
    location: {
      latitude: 20, // must be float to be valid
      longitude: 30
    }
  }
};
