import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  //VARIABLE PARA LA PAGINACION
  @Input() totalItems: number = 0;
  @Input() itemsRegisterPage: number = 10;
  @Input() currentPage: number = 1;
  @Output() pageChanged = new EventEmitter<number>();

  itemsPerPage: number = 10



  get totalPages(): (number | string)[] {
    const totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
    const visiblePages: (number | string)[] = [];


    if (totalPagesCount <= 7) {
      for (let i = 1; i <= totalPagesCount; i++) {
        visiblePages.push(i);
      }
    } else {
      visiblePages.push(1)
      if (this.currentPage > 4) {
        visiblePages.push('...')
      }

      const startPage = Math.max(2, this.currentPage - 1);
      const endPage = Math.min(totalPagesCount - 1, this.currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }

      if (this.currentPage < totalPagesCount - 3) {
        visiblePages.push('...')
      }

      visiblePages.push(totalPagesCount)
    }

    return visiblePages

  }

  changePage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage)
    }
  }

  getEndItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }



}
