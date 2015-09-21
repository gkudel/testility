namespace Testility.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Description : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.References", "Description", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.References", "Description");
        }
    }
}
