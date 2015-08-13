﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Testility.Domain.Abstract;
using Testility.Domain.Concrete;
using Testility.Domain.Entities;
using Testility.Engine.Abstract;
using Testility.WebUI.Services;

namespace Testility.WebUI.Areas.Setup.Controllers
{
    public class TestedClassesController : Controller
    {
        private ISetupRepository setupRepository;
        private ICreateInputClassFromFile fileRepository;
        private ICompiler compilerRepository;

        public TestedClassesController(ISetupRepository setupRepositor)
        {
            setupRepository = setupRepositor;
        }
        
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Description")] TestedClass testedClass)
        {
            return View();
        }

        public ActionResult Delete(int? id)
        {
            return View();
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            return RedirectToAction("Index", "SourceCodes");
        }

    }
}
