const express = require("express");
const CompanyRouter = require("./Administration/companyRouter");
const BranchRouter = require("./Administration/branchRouter");
const DepartmentRouter = require("./Administration/departmentRouter");
const EmployeeRouter = require("./Administration/employeeRouter");
const AdminRouter = require("./Login/adminRouter");
const TravelPolicyRouter = require("./Travel_Policy/travelPolicyRouter");
const BlogRouter = require("./Blog/blogRouter");
const FAQRouter = require("./FAQ/FAQRouter");
const AgencyRouter = require("./Agent/agentRouter");
const ServiceRouter = require("./manage_api/tableServiceRouter");
const DetailRouter = require("./manage_api/tableDetailRouter");
const AdditionDetailRouter = require("./manage_api/tableAdditionRouter");
const MemberRouter = require("./manage_api/tableMemberRouter");

const InvoiceRouter = require("./Invoice/invoiceRouter");
const smtpRouter = require("./Invoice/smtpRouter");
const manageCompany = require("./invoice/manageCompanyRouter");
const TicketRouter = require("./Tickets/ticketRouter");

const router = express.Router();

router.use("/login", AdminRouter);

// Administration
router.use("/company", CompanyRouter);
router.use("/branch", BranchRouter);
router.use("/department", DepartmentRouter);
router.use("/employee", EmployeeRouter);

// TravelPolicy
router.use("/travelPolicy", TravelPolicyRouter);

// Blog
router.use("/blog", BlogRouter);

// FAQ
router.use("/FAQ", FAQRouter);

// Agent
router.use("/Agency", AgencyRouter);

// Service
router.use("/Service_api", ServiceRouter);

// Details
router.use("/Details_api", DetailRouter);

// Details
router.use("/Addition_detail_api", AdditionDetailRouter);

// Member
router.use("/member_tb_api", MemberRouter);

// invoice
router.use("/invoice", InvoiceRouter);

// SMTP
router.use("/SMTP", smtpRouter);

// SMTP
router.use("/SMTP", smtpRouter);

// invoice company
router.use("/Invoice_company", manageCompany);

// Tickets
router.use("/Ticket", TicketRouter);


module.exports = router;
