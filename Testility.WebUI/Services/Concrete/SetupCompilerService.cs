﻿using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Testility.Domain.Abstract;
using Testility.Domain.Entities;
using Testility.Engine.Abstract;
using Testility.Engine.Model;
using Testility.WebUI.Services.Abstract;

namespace Testility.WebUI.Services.Concrete
{
    public class SetupCompilerService : ICompilerService
    {
        private readonly ICompiler compilerRepository;
        private ISetupRepository setupRepository;
        public SetupCompilerService(ICompiler compilerRepository, ISetupRepository setupRepository)
        {
            this.compilerRepository = compilerRepository;
            this.setupRepository = setupRepository;
        }

        public IList<Error> Compile(SolutionApi solution, int[] referencesIds)
        {
            Input input = Mapper.Map<Input>(solution);
            for (int i=0; i<(input.Code?.Length ?? 0); i++)
            {
                input.Code[i] = "using Testility.Engine.Attribute; " + input.Code[i];
            }
            input.ReferencedAssemblies = setupRepository.GetSelectedReferencesNames(referencesIds);
            Result r = compilerRepository.Compile(input);
            if (r.Errors.Count == 0)
            {
                Mapper.Map<Result, SolutionApi>(r, solution);
            }
            return r.Errors;
        }
    }
}