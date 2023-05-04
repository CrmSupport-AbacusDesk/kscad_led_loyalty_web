import { MatDialog } from '@angular/material';
import { ProductImageModuleComponent } from './../master/product-image-module/product-image-module.component';
import { Router } from '@angular/router';
import { DialogComponent } from './../dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catelog-product-img',
  templateUrl: './catelog-product-img.component.html',
  styleUrls: ['./catelog-product-img.component.scss']
})
export class CatelogProductImgComponent implements OnInit {
  uploadurl:any='';
  constructor(public db: DatabaseService,public dialog: DialogComponent,private router: Router, public alrt:MatDialog) {
    this.uploadurl = this.db.uploadUrl;

   }

  ngOnInit() {
    this.getProductList('');

  }

  addImageIcon=true;
  addProduct()
  {
      this.productForm={};
      this.addImageIcon=true;
  }


  loading: any;
  loading_list = false;
  current_page = 1;
  filter:any = {};
  filtering : any = false;
  catelogues:any=[];
  productForm: any = {};

  getProductList(action) 
  {
      this.loading_list = true;
      // this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      if( this.filter.date || this.filter.location_id )this.filtering = true;
      this.filter.mode = 0;
      
      if(action=='refresh')
      {
          this.filter={};
      }
      console.log(this.filter);
      
      this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'app_karigar/catalogueImageList')
      .subscribe( d => {
          console.log(d);
          this.loading_list = false;
          this.catelogues = d.image;
          
         
          
         
      });
  }

  removeImage()
  {
      this.productForm={};
  }
  savingData = false;
  toggle:any;
  saveProduct()
  {
    if(!this.productForm.image){
        this.dialog.error('Image is required');
        return;
    }
      this.savingData = true;
      this.db.post_rqst(this.productForm, 'master/addCatalogueImage')
      .subscribe( d => {
          console.log( d );
          if(d['status'] == 'PRODUCTEXIST' )
          {
              this.savingData = false;
              this.dialog.success('This Product Already exists');
              return;

              
          }
          this.savingData = false;
          this.productForm = {};
          this.toggle = "false";
          this.router.navigate(['catelog-product-img']);
          this.dialog.success('Product successfully save');
          this.getProductList('');
        
          
      });
  }


  openDialog(id ,string )
  {
      const dialogRef = this.alrt.open(ProductImageModuleComponent,{
          panelClass: 'zoom-box',
          data: {
              'id' : id,
              'mode' : string,
          }
      });
      dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
      });
  }

  deleteProduct(id) {
    this.dialog.delete('Product').then((result) => {
        if(result) {
            this.db.post_rqst({'id':id}, 'master/delete_catalogue_image')
            .subscribe(d => {
                console.log(d);
                this.getProductList('');
                this.dialog.successfully();
            });
        }
    });
} 
  onUploadChange(evt: any) {
    const file = evt.target.files[0];
    console.log(file);
    if (file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
        // this.docId = '';
    }
}
handleReaderLoaded(e) {
    this.productForm.image = 'data:image/png;base64,' + btoa(e.target.result) ;
    console.log( this.productForm.image );
}

}
