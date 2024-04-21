using System;
using ArtHub.Models;

namespace ArtHub.Services
{
    public interface TransactionService
    {
        Transaction CreateTransaction(Transaction createdTransaction);
        Transaction GetTransactionById(int id);
    }
}

