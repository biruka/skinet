using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using api.Dtos;
using api.Errors;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using api.Helpers;

namespace api.Controllers
{
    public class ProductsController : BaseApiController
    {
        IGenericRepository<Product> _productRepo;
        IGenericRepository<ProductBrand> _productBrandRepo;
        IGenericRepository<ProductType> _productTypeRepo;
        IMapper _mapper;
        public ProductsController(IGenericRepository<Product> productRepo,
                                  IGenericRepository<ProductBrand> productBrandRepo,
                                  IGenericRepository<ProductType> productTypeRepo,
                                  IMapper mapper)
        {
            _productRepo = productRepo;
            _productTypeRepo = productTypeRepo;
            _productBrandRepo =  productBrandRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery]ProductsSpecParams productPramas)
        {
           var spec = new ProductsWithTypesAndBrandsSpecification(productPramas);
            
           var countSpec = new ProductWithFiltersForCountSpecification(productPramas);

           var totalItems = await _productRepo.CountAsync(countSpec);

           var products = await _productRepo.ListAsync(spec);

           var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

           return Ok(new Pagination<ProductToReturnDto>(productPramas.PageIndex,productPramas.PageSize,
                                                        totalItems, data));
        }

        [HttpGet("brands")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _productBrandRepo.ListAllAsync());
        }

        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            return Ok(await _productTypeRepo.ListAllAsync());
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse) ,StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product =  await _productRepo.GetEntityWithSpec(spec);
            if (product == null) return NotFound(new ApiResponse(404));
            return _mapper.Map<Product, ProductToReturnDto>(product);
        }
    }
} 