function renderDateCell(data, url) {
  const linkTemplate = document.getElementById('link-template').content.cloneNode(true);
  const link = linkTemplate.querySelector('.link');
  link.setAttribute('href', url);
  link.textContent = data;
  const container = document.createElement('div');
  container.appendChild(linkTemplate);
  return container.innerHTML;
}

$(document).ready(function() {
  const $mappingsTable = $('#mappings');
  $mappingsTable.DataTable({
    processing: true,
    serverSide: true,
    lengthChange: false,
    ordering: false,
    ajax: {
      url: '/mappings/fetch',
      type: 'POST'
    },
    columns: [
      {
        data: 'shortUrl',
        searchable: false,
        render: function(data, type, row) {
          if(type === 'display') {
            return renderDateCell(data, row.shortUrl);
          }
          return data;
        }
      },
      {
        data: 'originalUrl',
        render: function(data, type, row) {
          if(type === 'display') {
            return renderDateCell(data, row.originalUrl);
          }
          return data;
        }
      },
      {
        data: 'clicksNum',
        searchable: false,
        render: function(data, type, row) {
          if(!data) {
            return '0';
          }
          return data;
        }
      },
      {
        data: 'createdAt',
        searchable: false,
        render: function(data, type, row) {
          if(!data) {
            return '-';
          }
          const datetime = new Date(data);
          return datetime.toLocaleString(
              navigator.language, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              });
        }
      },
      {
        data: null,
        searchable: false,
        render: function(data, type, row) {
          const btnTemplate = document.getElementById('delete-action-template').content.cloneNode(true);
          const deleteBtn = btnTemplate.querySelector('.btn-danger');
          deleteBtn.setAttribute('data-id', row.shortUrl.substring(1));
          const container = document.createElement('div');
          container.appendChild(btnTemplate);
          return container.innerHTML;
        }
      }
    ],
  });

  $mappingsTable.on('click', '.btn-danger', function() {
    const id = $(this).data('id');
    if(confirm(`Are you sure you want to delete the mapping ${id}?`)) {
      $.ajax({
        url: `/mappings/delete/${id}`,
        type: 'DELETE',
        success: function(result) {
          console.log(`Removal outcome: success=${result.success}, message=${result.message}`);
          const table = $mappingsTable.DataTable();
          const rowsOnCurrentPage = table.rows({ page: 'current' }).count();
          const currentPage = table.page();
          if(rowsOnCurrentPage === 1 && currentPage > 0) {
            // Step back to the previous page and reload
            table.page(currentPage - 1).draw('page');
          } else {
            // stay on the current page
            table.ajax.reload(null, false);
          }
        },
        error: function(xhr, status, error) {
          console.error(`Error deleting mapping: ${error}`);
        }
      });
    }
  });
});
