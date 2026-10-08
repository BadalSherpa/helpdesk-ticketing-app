const express = require('express');
const cors = require('cors');

//port configuration
const PORT = process.env.PORT || 5000;

const tickets = require("./data/ticket.js");

//create an instance of express 
//consider app as backend server
const app = express();

app.use(cors());
app.use(express.json());

//get request to the root route
app.get('/', (req, res) => {
  res.json({ message: "Helpdesk API is running"})
});

//get ticket api
app.get('/api/tickets',(req,res)=>{
  
  //server side search 
  const search = req?.query?.search?.toLowerCase().trim() || '';
  let filteredTickets = [...tickets];
  
  if (search) {
    filteredTickets = tickets.filter(ticket => {
      return Object.values(ticket).some(value =>
        String(value).toLowerCase().includes(search)
      );
    });
  }

  //server side status filter
  const status = req.query.status?.trim().toLowerCase() || "";

  let statusFilteredTickets = filteredTickets;

  if (status && status !== 'all') {
    statusFilteredTickets = statusFilteredTickets.filter(ticket => ticket.status?.toLocaleLowerCase() === status);
  }

  // server side sorting
  const sortBy = req.query.sortBy?.trim() || 'createdAt';
  const sortOrder = req.query.sortOrder?.trim().toLowerCase() || 'asc';

  if(sortOrder!=="asc" && sortOrder !=="desc"){
    return res.status(400).json({
      error: "Sortorder must be either asc or desc"
    })  
  }

  const sortingAllowedFields = ['id', 'subject', 'description', 'priority', 'assignee', 'status', 'createdAt'];

//validating that sortby includes either of the above fields from sortingAllowed Fields
  if(!sortingAllowedFields.includes(sortBy)){
    return res.status(400).json({
      error: `Sort by should have either of the following fields ${sortingAllowedFields.join(", ")}`
    })
  }

  // checks if sorting field exists else default bu createdAt
  const safeSortBy = sortingAllowedFields.includes(sortBy) ? sortBy : 'createdAt';


  statusFilteredTickets.sort((a, b) => {
    const valueA = a[safeSortBy];
    const valueB = b[safeSortBy];

    if(valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    }

    if(valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    }

    return 0;
  });

   

  //Pagaination Logics
  const page = req.query.page ? parseInt(req.query.page) :  1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5;


  //BE validations
  if(page<1) {
    return res.status(400).json({
      error: "Page must be greater than or equal to 1"
    })
  }

  if (pageSize < 1 || pageSize > 50) {
    return res.status(400).json({
      error : "PageSize must be between 1 to 50"
    })
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
      totalPages
    }
  })
});


//start the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})