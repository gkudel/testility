﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Testility.Domain.Entities
{
    public enum Language
    {
        CSharp, VisualBasic
    }

    public class SourceCode
    {
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        [Index("IX_SourceCode_Name", IsUnique = true)]
        [Remote("IsNameUnique", "Validation", ErrorMessage = "Source code name already exists.")]
        public string Name { get; set; }
        public string Code { get; set; }
        public Language Language { get; set; }
        public String ReferencedAssemblies { get; set; }
        public virtual ICollection<TestedClass> Clasess { get; set; }
    }
}
