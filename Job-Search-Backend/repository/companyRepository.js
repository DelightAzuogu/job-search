const { Company } = require("../model/company");

class CompanyRepository {
  CreateCompany = async (company) => await Company.create(company);

  GetCompanyByEmail = async (email) => await Company.findOne({ email: email });

  GetCompanyById = async (id) => await Company.findById(id);
}

exports.CompanyRepository = new CompanyRepository();
