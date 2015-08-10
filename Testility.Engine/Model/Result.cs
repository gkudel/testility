﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Testility.Engine.Model
{
    public class Result
    {
        public Result()
        {
            TestedClasses = new List<TestedClass>();
            Errors = new List<Error>();
        }

        public IList<TestedClass> TestedClasses { get; set; }
        public IList<Error> Errors { get; set; }
    }
}