using System;
using ArtHub.dto;
using ArtHub.Models;
using ArtHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArtHub.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly TransactionService _transactionService;
        private readonly UserService _userService;
        private readonly BidService _bidService;

        public TransactionController(TransactionService transactionService, UserService userService, BidService bidService)
        {
            _transactionService = transactionService;
            _userService = userService;
            _bidService = bidService;
        }

        [HttpGet("{id:int}")]
        public ActionResult Get(int id)
        {
            Transaction transaction = _transactionService.GetTransactionById(id);

            if (transaction == null)
            {
                return NotFound();
            }

            return Ok(transaction);
        }

        [HttpPost]
        public ActionResult CreateTransaction([FromBody] CreateTransactionDto createTransactionDto)
        {
            if (createTransactionDto == null)
            {
                return BadRequest("Invalid transaction data");
            }

            if (createTransactionDto.SameAsUser)
            {
                Bid bid = _bidService.FindBidById(createTransactionDto.BidId);
                User user = _userService.GetUserById(bid.BidderId);

                createTransactionDto.CardHolderFirstName = user.FirstName;
                createTransactionDto.CardHolderLastName = user.LastName;
                createTransactionDto.City = user.City;
                createTransactionDto.Province = user.Province;
                createTransactionDto.Country = user.Country;
                createTransactionDto.PostalCode = user.PostalCode;
            }

            Transaction createdTransaction = new Transaction(createTransactionDto.BidId,createTransactionDto.CardHolderFirstName,createTransactionDto.CardHolderLastName,createTransactionDto.City,createTransactionDto.Province, createTransactionDto.Country,createTransactionDto.PostalCode,createTransactionDto.CardType,createTransactionDto.CardNumber,createTransactionDto.ExpiryDate,createTransactionDto.CVV);

            // if (createdTransaction.Validate().isValid)
            // {
                createdTransaction = _transactionService.CreateTransaction(createdTransaction);
                return Ok(createdTransaction);
            // }
            // else
            // {
            //     return BadRequest(createdTransaction.Validate().errorMessage);
            // }

        }


    }
}


