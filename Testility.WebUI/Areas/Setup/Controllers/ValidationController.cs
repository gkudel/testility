﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Testility.Domain.Abstract;

namespace Testility.WebUI.Areas.Setup.Controllers
{
    public class ValidationController : Controller
    {
        private ISetupRepository setupRepository;

        public ValidationController(ISetupRepository setupRepositor)
        {
            setupRepository = setupRepositor;
        }

        public JsonResult IsNameUnique(string name)
        {
            return setupRepository.CheckSourceCodeNameIsUnique(name) ? Json(true, JsonRequestBehavior.AllowGet) : Json(false, JsonRequestBehavior.AllowGet);
        }
    }
}