const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, content, type) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(content);
  response.end();
};

const respondJSON = (request, response, status, content) => respond(request, response, status, JSON.stringify(content), 'application/json');

const respondXML = (request, response, status, content) => {
  let responseXML = '<response>';
  responseXML = `${responseXML} <message>${content.message}</message>`;
  if (content.id) { responseXML = `${responseXML} <id>${content.id}</id>`; }
  responseXML = `${responseXML} </response>`;
  return respond(request, response, status, responseXML, 'text/xml');
};

const getIndex = (request, response) => respond(request, response, 200, index, 'text/html');

const getCSS = (request, response) => respond(request, response, 200, css, 'text/css');

const success = (request, response) => {
  const status = 200;
  const responseContent = { message: 'This is a successful response!' };

  if (request.acceptedTypes[0] === 'text/xml') { return respondXML(request, response, status, responseContent); }

  return respondJSON(request, response, status, responseContent);
};

const badRequest = (request, response) => {
  let status = 501;
  const responseContent = { message: '' };

  if (request.query.valid === 'true') {
    status = 200;
    responseContent.message = 'This request has a valid parameter.';
  } else {
    status = 400;
    responseContent.message = 'Bad Request: invalid parameter.';
    responseContent.id = 'badRequest';
  }

  if (request.acceptedTypes[0] === 'text/xml') { return respondXML(request, response, status, responseContent); }

  return respondJSON(request, response, status, responseContent);
};

const unauthorized = (request, response) => {
  let status = 501;
  const responseContent = { message: '' };

  if (request.query.loggedIn === 'yes') {
    status = 200;
    responseContent.message = 'This request is authorized.';
  } else {
    status = 401;
    responseContent.message = 'Unauthorized Request: not logged in.';
    responseContent.id = 'unauthorizedRequest';
  }

  if (request.acceptedTypes[0] === 'text/xml') { return respondXML(request, response, status, responseContent); }

  return respondJSON(request, response, status, responseContent);
};

const forbidden = (request, response) => {
  const status = 403;
  const responseContent = {
    message: 'This request is forbidden.',
    id: 'forbidden',
  };

  if (request.acceptedTypes[0] === 'text/xml') { return respondXML(request, response, status, responseContent); }

  return respondJSON(request, response, status, responseContent);
};

const internal = (request, response) => {
  const status = 500;
  const responseContent = {
    message: 'There is an internal server error.',
    id: 'internal',
  };

  if (request.acceptedTypes[0] === 'text/xml') { return respondXML(request, response, status, responseContent); }

  return respondJSON(request, response, status, responseContent);
};

const notImplemented = (request, response) => {
  const status = 501;
  const responseContent = {
    message: 'This request is not implemented.',
    id: 'notImplemented',
  };

  if (request.acceptedTypes[0] === 'text/xml') { return respondXML(request, response, status, responseContent); }

  return respondJSON(request, response, status, responseContent);
};

const notFound = (request, response) => {
  const status = 404;
  const responseContent = {
    message: 'This request could not be found.',
    id: 'notFound',
  };

  if (request.acceptedTypes[0] === 'text/xml') { return respondXML(request, response, status, responseContent); }

  return respondJSON(request, response, status, responseContent);
};

module.exports = {
  getIndex,
  getCSS,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
