const express = require('express');
const cors = require('cors');

//port configuration
const PORT = process.env.PORT || 5000;

const tickets = require('./data/ticket.js');

//create an instance of express
//consider app as backend server
const app = express();

app.use(cors());
app.use(express.json());

//get request to the root route
app.get('/', (req, res) => {
  res.json({ message: 'Helpdesk API is running' });
});

//GET: Get tickets API route
app.get('/api/tickets', (req, res) => {
  //server side search
  const search = req?.query?.search?.toLowerCase().trim() || '';
  let filteredTickets = [...tickets];

  if (search) {
    filteredTickets = tickets.filter((ticket) => {
      return Object.values(ticket).some((value) =>
        String(value).toLowerCase().includes(search),
      );
    });
  }

  //server side status filter
  const status = req.query.status?.trim().toLowerCase() || '';

  let statusFilteredTickets = filteredTickets;

  if (status && status !== 'all') {
    statusFilteredTickets = statusFilteredTickets.filter(
      (ticket) => ticket.status?.toLocaleLowerCase() === status,
    );
  }

  // server side sorting
  const sortBy = req.query.sortBy?.trim() || 'createdAt';
  const sortOrder = req.query.sortOrder?.trim().toLowerCase() || 'asc';

  if (sortOrder !== 'asc' && sortOrder !== 'desc') {
    return res.status(400).json({
      error: 'Sortorder must be either asc or desc',
    });
  }

  const sortingAllowedFields = [
    'id',
    'subject',
    'description',
    'priority',
    'assignee',
    'status',
    'createdAt',
  ];

  //validating that sortby includes either of the above fields from sortingAllowed Fields
  if (!sortingAllowedFields.includes(sortBy)) {
    return res.status(400).json({
      error: `Sort by should have either of the following fields ${sortingAllowedFields.join(', ')}`,
    });
  }

  // checks if sorting field exists else default bu createdAt
  const safeSortBy = sortingAllowedFields.includes(sortBy)
    ? sortBy
    : 'createdAt';

  statusFilteredTickets.sort((a, b) => {
    const valueA = a[safeSortBy];
    const valueB = b[safeSortBy];

    if (valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    }

    if (valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    }

    return 0;
  });

  //Pagaination Logics
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5;

  //BE validations
  if (page < 1) {
    return res.status(400).json({
      error: 'Page must be greater than or equal to 1',
    });
  }

  if (pageSize < 1 || pageSize > 50) {
    return res.status(400).json({
      error: 'PageSize must be between 1 to 50',
    });
  }

  const totalTickets = statusFilteredTickets.length;
  const totalPages = Math.ceil(totalTickets / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedTickets = statusFilteredTickets.slice(startIndex, endIndex);

  res.json({
    data: paginatedTickets,
    meta: {
      page,
      pageSize,
      totalTickets,
      totalPages,
    },
  });
});

//helper
function generateTicketId() {
  const numbers = tickets.map((ticket) => {
    return Number(ticket.id.replace('TKT-', ''));
  });

  const maxNumber = Math.max(...numbers);

  return `TKT-${maxNumber + 1}`;
}

//POST : create tickets API route
app.post('/api/tickets', (req, res) => {
  const { title, description, priority, status, assignee } = req.body;

  //Required validation
  if (!title || !description || !priority || !status || !assignee) {
    return res.status(404).status({
      error: ' title,description,priority,status,assignee are required',
    });
  }

  //validate Priority

  const allowedPriorities = ['low', 'high', 'medium'];

  if (!allowedPriorities.includes(priority.toLowerCase())) {
    res.status(400).status({
      error: `Priority must me either of these: ${allowedPriorities.join(', ')}`,
    });
  }

  //validate Status

  const allowedStatus = ['open', 'in_progress', 'closed'];

  if (!allowedStatus.includes(status.toLowerCase())) {
    res.status(400).status({
      error: `Status must me either of these: ${allowedStatus.join(', ')}`,
    });
  }

  //create newTicket
  const newTicket = {
    id: generateTicketId(),
    title,
    description,
    status,
    priority,
    assignee: assignee || null,
    createdAt: new Date().toISOString(),
  };

  //add the new objec to tickets array
  tickets.push(newTicket);

  //Return created tickets
  res.status(201).json({
    data: newTicket,
  });
});

//PATCH : Update API
app.patch('/api/tickets/:id', (req, res) => {
  //get the id for the ticket to be updated/patched
  const { id } = req.params;

  //find the ticket
  const updateTicket = tickets.find((ticket) => ticket.id === id);
  console.log('ENTERED', updateTicket);

  if (!updateTicket) {
    return res.status(400).json({
      error: `Ticket with id ${id} not found`,
    });
  }

  //fields that are allowed to be updated
  const allowedFields = [
    'title',
    'description',
    'status',
    'priority',
    'status',
    'assignee',
    'subject',
  ];

  //get updates from body

  const updates = req.body;

  // Reject an empty request object

  if (
    !updates ||
    typeof updates !== 'object' ||
    Array.isArray(updates) ||
    Object.keys(updates).length == 0
  ) {
    return res.status(400).json({
      error: `Atleast one of these fields ${allowedFields.join(' , ')} must be updated`,
    });
  }

  //Reject unsupported fields
  const invalidFields = Object.keys(updates).filter((field) => {
    return !allowedFields.includes(field);
  });

  if (invalidFields.length > 0) {
    return res.status(400).json({
      error: `Field cannot be updated: ${invalidFields.join(' ,')}`,
    });
  }

  const allowedPriorities = ['low', 'medium', 'high'];

  if (
    updates.priority !== undefined &&
    !allowedPriorities.includes(updates.priority.toLowerCase())
  ) {
    return res.status(400).json({
      error: `Priority must be  either of these : ${allowedPriorities.join(' ,')}`,
    });
  }

  const allowedStatus = ['open', 'in_progress', 'closed'];

  if (
    updates.status !== undefined &&
    !allowedStatus.includes(updates.status.toLowerCase())
  ) {
    return res.status(400).json({
      error: `Status must be  either of these : ${allowedStatus.join(' ,')}`,
    });
  }

  //validate text field if supplied

  for (const field of ['title', ' description', 'subject']) {
    if (
      updates[field] !== undefined &&
      (typeof updates[field] !== 'string' || updates[field].trim() === '')
    ) {
      return res.status(400).json({
        error: `${field} must be a non empty string`,
      });
    }
  }
  if (
    updates.assignee !== null &&
    updates.assignee !== undefined &&
    typeof updates.assignee !== 'string'
  ) {
    return res.status(400).json({
      error: 'Assignee must be string or null',
    });
  }

  // update only the supplied fields
  Object.assign(updateTicket, updates);

  //return updated ticket
  return res.status(200).json({
    message: 'Ticket updated successfully',
    data: updateTicket,
  });
});

//DELETE : Delete api
app.delete('/api/tickets/:id', (req, res) => {
  const { id } = req.params;

  console.log('TICKET ID', id);

  //find the ticket index in all the tickets
  const ticketIndex = tickets.findIndex((ticket) => {
    return ticket.id === id;
  });

  //if the ticket id does not exist
  if (ticketIndex === -1) {
    return res.status(404).json({
      error: `Ticket with ticket ID ${id} not found`,
    });
  }

  const [deletedTIcket] = tickets.splice(ticketIndex, 1); // splice updates the original array

  return res.status(200).json({
    message: `Ticket with ticket ID ${id} successfully deleted`,
    data: deletedTIcket,
  });
});

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
