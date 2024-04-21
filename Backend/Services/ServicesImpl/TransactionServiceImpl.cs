using System;
using ArtHub.Models;

namespace ArtHub.Services.ServicesImpl
{
    public class TransactionServiceImpl : TransactionService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public TransactionServiceImpl(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;

        }
        public Transaction CreateTransaction(Transaction createdTransaction)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                createdTransaction = context.Transactions.Add(createdTransaction).Entity;

                context.SaveChanges();

                return createdTransaction;
            }
        }

        public Transaction GetTransactionById(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                Transaction transaction = context.Transactions.Find(id);
                return transaction;

            }
        }
    }
}

