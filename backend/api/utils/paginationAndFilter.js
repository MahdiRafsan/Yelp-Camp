const { NotFoundError } = require("../errors");

// campground → search by location, filter by price
// review → search by rating greater than or less than some vale
// user → search by username, email and/or role
const paginationAndFilter = async (
  model,
  paginationOptions = {},
  queryOptions = {}
) => {
  const { page, limit } = paginationOptions;

  let query = model.find(queryOptions);

  // check if data model has author described in schema
  if (model.schema.path("author")) {
    query.populate({ path: "author", select: "username id profile_pic" });
  }

  // PAGINATION
  const currentPage = parseInt(page) || 1;
  const limitPerPage = parseInt(limit) || 15;
  const skip = (currentPage - 1) * limitPerPage;
  const totalDocs = await model.countDocuments(queryOptions);
  const totalPages = Math.ceil(totalDocs / limitPerPage);

  if (totalDocs && currentPage > totalPages) {
    throw new NotFoundError(`Page ${currentPage} not found!`);
  }

  // await result and sort
  const data = await query
    .skip(skip)
    .limit(limitPerPage)
    .sort({ createdAt: "desc" });

  return { data, totalPages, currentPage, totalDocs };
};

module.exports = paginationAndFilter;
