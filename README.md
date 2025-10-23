# Perimetral Tandil - Landing Page

Landing page profesional para Perimetral Tandil, empresa especializada en cercos perimetrales y artículos rurales.

## Características

- **Diseño Dual**: La página ofrece dos secciones principales claramente diferenciadas:
  - **Cercos Perimetrales**: Para necesidades urbanas y residenciales
  - **Artículos Rurales**: Para actividades agrícolas y rurales

- **Colores de Marca**: 
  - Rojo (#DC2626)
  - Negro (#000000) 
  - Amarillo (#FCD34D)

- **Tecnología**: Desarrollada con Angular 20, con SSR habilitado y diseño responsive

## Servidor de Desarrollo

Para iniciar el servidor de desarrollo local:

```bash
ng serve
```

Navega a `http://localhost:4200/` en tu navegador. La aplicación se recargará automáticamente cuando modifiques los archivos.

## Estructura del Proyecto

```
src/
├── app/
│   ├── app.html          # Template principal con landing page
│   ├── app.scss          # Estilos personalizados con colores de marca
│   ├── app.ts            # Componente principal con lógica de navegación
│   └── app.routes.ts     # Configuración de rutas
├── styles.scss           # Estilos globales
└── index.html           # Archivo HTML principal
```

## Compilación

Para compilar el proyecto:

```bash
ng build
```

Los archivos compilados se guardarán en el directorio `dist/`. La compilación de producción optimiza la aplicación para rendimiento.

## Testing

Para ejecutar las pruebas unitarias:

```bash
ng test
```

## Próximos Pasos

1. Crear componentes separados para cada sección (Cercos y Rurales)
2. Implementar rutas para navegación entre secciones
3. Agregar formularios de contacto
4. Integrar galería de productos
5. Añadir información de contacto y ubicación

## Soporte

Para más información sobre Angular CLI: `ng help` o visita [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
