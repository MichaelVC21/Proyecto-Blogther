import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PerfilDetalleComponent } from './perfil-detalle.component';
import { DatabaseService } from 'src/app/services/database.service';

describe('PerfilDetalleComponent', () => {
  let component: PerfilDetalleComponent;
  let fixture: ComponentFixture<PerfilDetalleComponent>;
  let mockDatabaseService: jasmine.SpyObj<DatabaseService>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPerfil = {
    id: 'test-id',
    nombre: 'Florentina',
    foto: 'https://example.com/avatar.jpg',
    descripcion: 'Opa vente al perfil',
    seguidores: 12,
    seguidos: 10,
    plantas: [
      {
        id: '1',
        nombre: 'Rositas',
        imagen: 'https://example.com/rositas.jpg'
      },
      {
        id: '2',
        nombre: 'Hojas azules',
        imagen: 'https://example.com/hojas-azules.jpg'
      }
    ]
  };

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
      imports: [PerfilDetalleComponent, IonicModule.forRoot()],
      providers: [
        { provide: DatabaseService, useValue: dbSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilDetalleComponent);
    component = fixture.componentInstance;
    mockDatabaseService = TestBed.inject(DatabaseService) as jasmine.SpyObj<DatabaseService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  it('should create', () => {
    mockDatabaseService.getDocumentById.and.returnValue(of(mockPerfil));
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.perfil).toBeNull();
    expect(component.loading).toBe(true);
    expect(component.error).toBe(false);
    expect(component.notFound).toBe(false);
  });

  it('should fetch profile on init when ID is provided', () => {
    mockDatabaseService.getDocumentById.and.returnValue(of(mockPerfil));
    
    component.ngOnInit();
    
    expect(mockDatabaseService.getDocumentById).toHaveBeenCalledWith('perfil', 'test-id');
    expect(component.perfil).toEqual(jasmine.objectContaining({
      id: 'test-id',
      nombre: 'Florentina',
      foto: 'https://example.com/avatar.jpg',
      descripcion: 'Opa vente al perfil',
      seguidores: 12,
      seguidos: 10
    }));
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
    expect(component.notFound).toBe(false);
  });

  it('should handle missing profile ID', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalledWith('No se proporcionó ID del perfil');
    expect(component.loading).toBe(false);
    expect(mockDatabaseService.getDocumentById).not.toHaveBeenCalled();
  });

  it('should handle empty profile data as not found', () => {
    mockDatabaseService.getDocumentById.and.returnValue(of({}));
    
    component.fetchPerfil();
    
    expect(component.perfil).toBeNull();
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
    expect(component.notFound).toBe(true);
  });

  it('should handle database service error', () => {
    const errorMessage = 'Database connection failed';
    mockDatabaseService.getDocumentById.and.returnValue(throwError(errorMessage));
    spyOn(console, 'error');
    
    component.fetchPerfil();
    
    expect(console.error).toHaveBeenCalledWith('Error al cargar el perfil:', errorMessage);
    expect(component.loading).toBe(false);
    expect(component.error).toBe(true);
    expect(component.notFound).toBe(false);
    expect(component.perfil).toBeNull();
  });

  it('should handle profile with default values when fields are missing', () => {
    const incompleteProfile = {
      id: 'test-id',
      nombre: 'Usuario Test'
      // Missing other fields
    };
    mockDatabaseService.getDocumentById.and.returnValue(of(incompleteProfile));
    
    component.fetchPerfil();
    
    expect(component.perfil).toEqual(jasmine.objectContaining({
      id: 'test-id',
      nombre: 'Usuario Test',
      foto: '',
      descripcion: '',
      seguidores: 0,
      seguidos: 0,
      plantas: []
    }));
  });

  it('should set default nombre when missing', () => {
    const profileWithoutName = {
      id: 'test-id',
      foto: 'test.jpg',
      seguidores: 5
    };
    mockDatabaseService.getDocumentById.and.returnValue(of(profileWithoutName));
    
    component.fetchPerfil();
    
    expect(component.perfil?.nombre).toBe('Usuario');
  });

  it('should call retryLoad and fetch profile again', () => {
    spyOn(component, 'fetchPerfil');
    
    component.retryLoad();
    
    expect(component.fetchPerfil).toHaveBeenCalled();
  });

  it('should navigate back when goBack is called with history', () => {
    spyOn(window.history, 'back');
    Object.defineProperty(window.history, 'length', { value: 2, configurable: true });
    
    component.goBack();
    
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should navigate to perfiles when goBack is called without history', () => {
    Object.defineProperty(window.history, 'length', { value: 1, configurable: true });
    
    component.goBack();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/perfiles']);
  });

  it('should properly clean up subscriptions on destroy', () => {
    const mockSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription'] = mockSubscription;
    
    component.ngOnDestroy();
    
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should handle profile with plantas array', () => {
    mockDatabaseService.getDocumentById.and.returnValue(of(mockPerfil));
    
    component.fetchPerfil();
    
    expect(component.perfil?.plantas).toEqual([
      {
        id: '1',
        nombre: 'Rositas',
        imagen: 'https://example.com/rositas.jpg'
      },
      {
        id: '2',
        nombre: 'Hojas azules',
        imagen: 'https://example.com/hojas-azules.jpg'
      }
    ]);
  });

  it('should handle profile with empty plantas array', () => {
    const profileWithEmptyPlantas = {
      ...mockPerfil,
      plantas: []
    };
    mockDatabaseService.getDocumentById.and.returnValue(of(profileWithEmptyPlantas));
    
    component.fetchPerfil();
    
    expect(component.perfil?.plantas).toEqual([]);
  });

  it('should use correct collection name for database query', () => {
    mockDatabaseService.getDocumentById.and.returnValue(of(mockPerfil));
    
    component.fetchPerfil();
    
    expect(mockDatabaseService.getDocumentById).toHaveBeenCalledWith('perfil', component.perfilId);
  });

  it('should set loading state correctly during fetch', () => {
    mockDatabaseService.getDocumentById.and.returnValue(of(mockPerfil));
    
    // Initial state
    component.loading = false;
    
    // Start fetch
    component.fetchPerfil();
    
    // Should be loading initially
    expect(component.loading).toBe(true);
    expect(component.error).toBe(false);
    expect(component.notFound).toBe(false);
  });
});