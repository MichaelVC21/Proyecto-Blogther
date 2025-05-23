import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ArticuloDetalleComponent } from './articulo-detalle.component';
import { DatabaseService } from 'src/app/services/database.service';

describe('ArticuloDetalleComponent', () => {
  let component: ArticuloDetalleComponent;
  let fixture: ComponentFixture<ArticuloDetalleComponent>;
  let mockDatabaseService: jasmine.SpyObj<DatabaseService>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    const dbSpy = jasmine.createSpyObj('DatabaseService', ['getDocumentById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('test-id')
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [ArticuloDetalleComponent, IonicModule.forRoot()],
      providers: [
        { provide: DatabaseService, useValue: dbSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticuloDetalleComponent);
    component = fixture.componentInstance;
    mockDatabaseService = TestBed.inject(DatabaseService) as jasmine.SpyObj<DatabaseService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  it('should create', () => {
    // Mock la respuesta del servicio para evitar errores
    mockDatabaseService.getDocumentById.and.returnValue(of({}));
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.articulo).toBeNull();
    expect(component.loading).toBe(true);
    expect(component.selectedSegment).toBe('descripcion');
  });

  it('should fetch article on init when ID is provided', () => {
    const mockArticulo = { 
      id: 'test-id', 
      nombre: 'Lavanda', 
      informacion: 'Test Description',
      imagen: 'test-image.jpg'
    };
    mockDatabaseService.getDocumentById.and.returnValue(of(mockArticulo));
    
    component.ngOnInit();
    
    expect(mockDatabaseService.getDocumentById).toHaveBeenCalledWith('Articulos', 'test-id');
    expect(component.articulo).toEqual(mockArticulo);
    expect(component.loading).toBe(false);
  });

  it('should handle missing article ID', () => {
    // Simular que no hay ID en la ruta
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalledWith('No se proporcionó ID del artículo');
    expect(component.loading).toBe(false);
    expect(mockDatabaseService.getDocumentById).not.toHaveBeenCalled();
  });

  it('should handle empty article ID', () => {
    // Simular que hay un ID vacío
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('');
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalledWith('No se proporcionó ID del artículo');
    expect(component.loading).toBe(false);
    expect(mockDatabaseService.getDocumentById).not.toHaveBeenCalled();
  });

  it('should handle database service error', () => {
    const errorMessage = 'Database error';
    mockDatabaseService.getDocumentById.and.returnValue(throwError(errorMessage));
    spyOn(console, 'error');
    
    component.fetchArticulo();
    
    expect(console.error).toHaveBeenCalledWith('Error al obtener el artículo:', errorMessage);
    expect(component.loading).toBe(false);
    expect(component.articulo).toBeNull();
  });

  it('should change segment when onSegmentChanged is called', () => {
    const mockEvent = {
      detail: {
        value: 'cuidados'
      }
    };
    
    component.onSegmentChanged(mockEvent);
    
    expect(component.selectedSegment).toBe('cuidados');
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/articulos']);
  });

  it('should set loading to true when fetchArticulo starts', () => {
    mockDatabaseService.getDocumentById.and.returnValue(of({}));
    component.loading = false; // Simular que ya estaba en false
    
    component.fetchArticulo();
    
    expect(component.loading).toBe(true);
  });

  it('should set loading to false after successful fetch', () => {
    const mockArticulo = { nombre: 'Test Plant' };
    mockDatabaseService.getDocumentById.and.returnValue(of(mockArticulo));
    
    component.fetchArticulo();
    
    expect(component.loading).toBe(false);
    expect(component.articulo).toEqual(mockArticulo);
  });

  it('should handle article with all properties', () => {
    const completeArticulo = {
      id: 'test-id',
      nombre: 'Lavanda',
      informacion: 'Descripción completa',
      imagen: 'lavanda.jpg',
      precio: 25,
      categoria: 'Aromáticas',
      stock: 10,
      cuidados: {
        riego: 'Moderado',
        luz: 'Sol directo',
        temperatura: '15-25°C',
        humedad: 'Baja'
      },
      curiosidades: ['Dato 1', 'Dato 2'],
      plagas: [
        { nombre: 'Pulgones', descripcion: 'Insectos pequeños' },
        { nombre: 'Ácaros', descripcion: 'Arácnidos microscópicos' }
      ]
    };
    
    mockDatabaseService.getDocumentById.and.returnValue(of(completeArticulo));
    
    component.fetchArticulo();
    
    expect(component.articulo).toEqual(completeArticulo);
    expect(component.loading).toBe(false);
  });
});