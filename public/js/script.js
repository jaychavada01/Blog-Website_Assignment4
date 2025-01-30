//*  =========================== Admin panel: Handle blog form submission ===================================
const addBlogForm = document.getElementById("addBlogForm");
addBlogForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addBlogForm);

  try {
    const response = await fetch("/add", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Blog created successfully!");
      window.location.reload();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while creating the blog.");
  }
});

//*  =========================== Admin panel: Handle category form submission ===================================
const addCategoryForm = document.getElementById("addCategoryForm");
addCategoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addCategoryForm);

  try {
    const response = await fetch("/categories/add", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Category created successfully!");
      window.location.reload();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while creating the category.");
  }
});

//*  =========================== Admin panel: JavaScript for rendering dynamic content ===================================
const links = document.querySelectorAll(".sidebar a[data-page]");
const dynamicContent = document.getElementById("dynamicContent");
const defaultContent = document.getElementById("defaultContent");

links.forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    const page = link.getAttribute("data-page");

    defaultContent.style.display = "none";
    dynamicContent.classList.remove("d-none");
    dynamicContent.innerHTML = ""; // Clear previous content

    if (page === "viewBlogs") {
      await loadBlogs();
    } else if (page === "viewCategories") {
      await loadCategories();
    }
  });
});

//*  =========================== Admin panel: JavaScript for rendering dynamic content for blogs ===================================
async function loadBlogs() {
  dynamicContent.innerHTML = `
  <h3>Blogs</h3>
  <div class="card">
  <div class="card-header"><h5>All Blogs</h5></div>
  <div class="card-body">
  <div class="table-responsive">
  <table class="table table-bordered table-striped">
  <thead>
  <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="blogTableBody"></tbody>
            </table>
            </div>
            </div>
            </div>`;

  try {
    const response = await fetch("/allblogs");
    const blogs = await response.json();
    const blogTableBody = document.getElementById("blogTableBody");

    blogs.forEach((blog) => {
      blogTableBody.innerHTML += `
        <tr>
          <td>${blog.title}</td>
          <td>${blog.description}</td>
          <td>${blog.category?.name || "N/A"}</td>
          <td>${new Date(blog.createdAt).toLocaleDateString()}</td>
          <td>
          <button class="btn btn-success btn-sm" onclick="editBlog('${
            blog.slug
          }')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteBlog('${
              blog.slug
            }')">Delete</button>
            </td>
            </tr>`;
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    dynamicContent.innerHTML = '<p class="text-danger">Error loading blogs</p>';
  }
}

//? Handle Edit Blog
async function editBlog(slug) {
  try {
    const response = await fetch(`/blog/${slug}`);
    const blog = await response.json();
    if (blog) {
      document.getElementById("editBlogSlug").value = slug;
      document.getElementById("editBlogTitle").value = blog.title;
      document.getElementById("editBlogDescription").value = blog.description;
      new bootstrap.Modal(document.getElementById("editBlogModal")).show();
    }
  } catch (error) {
    alert("Failed to load blog details");
  }
}

document
  .getElementById("editBlogForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const slug = document.getElementById("editBlogSlug").value;
    const updatedBlog = {
      title: document.getElementById("editBlogTitle").value,
      description: document.getElementById("editBlogDescription").value,
    };
    try {
      await fetch(`/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBlog),
      });
      alert("Blog updated successfully!");
      document
        .getElementById("editBlogModal")
        .querySelector(".btn-close")
        .click();
      loadBlogs();
    } catch (error) {
      alert("Error updating blog");
    }
  });

window.onload = loadBlogs;

//? Delete Functions
async function deleteBlog(slug) {
  if (confirm("Are you sure you want to delete this blog?")) {
    try {
      const response = await fetch(`/blog/${slug}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        alert("Blog deleted successfully!");
        loadBlogs();
      }
    } catch (error) {
      alert("Error deleting blog");
    }
  }
}

//*  =========================== Admin panel: JavaScript for rendering dynamic content for categories ===================================
async function loadCategories() {
  const dynamicContent = document.getElementById("dynamicContent");
  dynamicContent.innerHTML = `
<h3>Categories</h3>
<div class="card">
<div class="card-header"><h5>All Categories</h5></div>
<div class="card-body">
  <div class="table-responsive">
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="categoryTableBody"></tbody>
    </table>
  </div>
</div>
</div>`;

  try {
    const response = await fetch("/allcategories"); // Fetch all categories
    const categories = await response.json();
    const categoryTableBody = document.getElementById("categoryTableBody");

    // Clear existing rows
    categoryTableBody.innerHTML = "";

    // Add rows for each category
    categories.forEach((category) => {
      categoryTableBody.innerHTML += `
  <tr>
    <td>${category.name}</td>
    <td>${new Date(category.createdAt).toLocaleDateString()}</td>
    <td>
      <button class="btn btn-success btn-sm" onclick="editCategory('${
        category._id
      }')">Edit</button>
      <button class="btn btn-danger btn-sm" onclick="deleteCategory('${
        category._id
      }')">Delete</button>
    </td>
  </tr>`;
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    dynamicContent.innerHTML =
      '<p class="text-danger">Error loading categories</p>';
  }
}

//? Edit a category
async function editCategory(id) {
  try {
    const response = await fetch(`/categories/getOne/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => {
        throw new Error("Invalid response format or not found");
      });
      throw new Error(errorData.message || "Category not found");
    }

    const category = await response.json();
    document.getElementById("editCategoryId").value = id;
    document.getElementById("editCategoryName").value = category.name;
    new bootstrap.Modal(document.getElementById("editCategoryModal")).show();
  } catch (error) {
    alert("Failed to load category details: " + error.message);
  }
}

document
  .getElementById("editCategoryForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.getElementById("editCategoryId").value;
    const updatedCategory = {
      name: document.getElementById("editCategoryName").value,
    };

    try {
      const response = await fetch(`/categories/updateOne/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      });
      const result = await response.json();
      if (result.success) {
        alert("Category updated successfully!");
        document
          .getElementById("editCategoryModal")
          .querySelector(".btn-close")
          .click();
        loadCategories(); // Reload categories after update
      }
    } catch (error) {
      alert("Error updating category");
    }
  });

//? Delete a category
async function deleteCategory(id) {
  if (confirm("Are you sure you want to delete this category?")) {
    try {
      const response = await fetch(`/categories/deleteOne/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        alert("Category deleted successfully!");
        loadCategories(); // Reload categories after deletion
      }
    } catch (error) {
      alert("Error deleting category");
    }
  }
}

// Load categories when the page loads
window.onload = loadCategories;