import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantData, PlantEntry, plantsData } from 'src/app/data/plantsData';


@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.page.html',
  styleUrls: ['./plant-detail.page.scss'],
  standalone: false,
})

export class PlantDetailPage implements OnInit {
  plant!: PlantData;
  entries: PlantEntry[] = [];
  selectedEntry!: PlantEntry;
  uniqueLocations: string[] = [];
  todayIso = new Date().toISOString();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    const pd = plantsData[id];
    if (!pd) {
      this.back();
      return;
    }
    this.plant = pd;
    this.entries = [...this.plant.entries];
    // Selecciono la última entrada por defecto
    this.selectedEntry = this.entries[this.entries.length - 1];
    // Extraigo todas las ubicaciones únicas
    this.uniqueLocations = Array.from(
      new Set(this.entries.flatMap((e) => e.location))
    );
  }

  back() {
    this.router.navigate(['/tabs/plantas']);
  }

  selectEntry(entry: PlantEntry) {
    this.selectedEntry = entry;
  }

  addEntry() {
    this.router.navigate(['/tabs/new-plant'], {
      queryParams: { plantId: this.plant.id },
    });
  }
}
