$(document).ready(function() {
    // Inicializa DataTables
    $('#productosTable').DataTable();
  
    // Maneja el evento de clic en el botón de eliminar producto
    $('.delete-button').on('click', function(e) {
      e.preventDefault();
      const productId = $(this).data('id');
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
      }).then((result) => {
        if (result.isConfirmed) {
          // Realiza una llamada AJAX para eliminar el producto
          $.ajax({
            url: '/dashboard/inventario/delete/' + productId, // Ajusta esta URL según tu configuración de rutas
            method: 'POST',  // Cambiado a POST si no se utiliza DELETE en el formulario
            success: function(response) {
              Swal.fire(
                'Eliminado!',
                'El producto ha sido eliminado.',
                'success'
              ).then(() => {
                location.reload();
              });
            },
            error: function(err) {
              Swal.fire(
                'Error!',
                'No se pudo eliminar el producto.',
                'error'
              );
            }
          });
        }
      });
    });
  
    // Maneja el evento de envío de formularios de edición de productos
    $(document).on('submit', 'form[id^="editForm"]', function(e) {
      e.preventDefault();
      const form = $(this);
      const productId = form.attr('action').split('/').pop();
      const formData = form.serialize();
  
      // Realiza una llamada AJAX para actualizar el producto
      $.ajax({
        url: '/dashboard/inventario/edit/' + productId, // Ajusta esta URL según tu configuración de rutas
        method: 'POST',
        data: formData,
        success: function(response) {
          Swal.fire(
            'Actualizado!',
            'El producto ha sido actualizado correctamente.',
            'success'
          ).then(() => {
            location.reload();
          });
        },
        error: function(err) {
          Swal.fire(
            'Error!',
            'No se pudo actualizar el producto.',
            'error'
          );
        }
      });
    });
  
    // Maneja el evento de envío del formulario de nuevo producto
    $('#newProductForm').on('submit', function(e) {
      e.preventDefault();
      const formData = $(this).serialize();
  
      // Realiza una llamada AJAX para agregar un nuevo producto
      $.ajax({
        url: '/dashboard/inventario/add', // Ajusta esta URL según tu configuración de rutas
        method: 'POST',
        data: formData,
        success: function(response) {
          Swal.fire(
            'Producto Agregado!',
            'El nuevo producto ha sido agregado exitosamente.',
            'success'
          ).then(() => {
            location.reload(); // Recarga la página para actualizar la lista de productos
          });
        },
        error: function(err) {
          Swal.fire(
            'Error!',
            'No se pudo agregar el producto.',
            'error'
          );
        }
      });
    });
  
    // Toggle para mostrar u ocultar el formulario de agregar producto
    $('#toggleFormBtn').click(function() {
      $('#addProductForm').toggle('slow', function() {
        if ($('#addProductForm').is(':visible')) {
          $('#toggleFormBtn').text('Cancelar');
        } else {
          $('#toggleFormBtn').text('Agregar Producto');
        }
      });
    });
  });
  