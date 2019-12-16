import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ludogame',
  templateUrl: './ludogame.component.html',
  styleUrls: ['./ludogame.component.css']
})
export class LudogameComponent implements OnInit {

  constructor(private elRef: ElementRef) { }

  public dice_result = 0;
  private clickable: boolean = false;
  //private move_enable: boolean = false;

  private piece_pos_arr = {};

  ngOnInit() {
  }

  refresh(): void {
    window.location.reload();
  }

  roll_the_dice(){
    document.getElementById('dice_result').innerHTML = '<img src="assets/images/dice-rolling.gif" style="width: 120px;">';

    //setTimeout(function(){
      const dice_array = Array(1, 2, 3, 4, 5, 6);
      var dice_output = dice_array[Math.floor(Math.random()*dice_array.length)];

      document.getElementById('dice_result').innerHTML = '<img src="assets/images/dice-'+dice_output+'.png" style="width: 65px;">';

      this.dice_result = dice_output;
    //}, 1000);
  }

  delete_by_value(piece_pos, piece_id, temp_array) {
    if( typeof this.piece_pos_arr[piece_pos] !== 'undefined' ){
      var piece_pos_str = this.piece_pos_arr[piece_pos].toString();
    }

    for(var f in this.piece_pos_arr) {
      if(this.piece_pos_arr[f] == piece_id) {
        delete this.piece_pos_arr[f];
      }

      if( (typeof piece_pos_str !== 'undefined') && (isNaN(piece_pos_str)) ){
        if( temp_array.indexOf(piece_pos_str) < 0 ){
          var add_piece_arr = temp_array.push( piece_pos_str );
          add_piece_arr.toString().split(',');

          this.piece_pos_arr[piece_pos] = add_piece_arr;
        }
      }
      //
    }
  }

  piece_positions(parent_pos, destination_pos, piece_id){
    //+++++++++++++++++++ BEGIN :: Start +++++++++++++++++++//
    var parent_pos_item:any[]  = this.piece_pos_arr[parent_pos];
    //console.log(parent_pos_item);

    if(typeof parent_pos_item !== 'undefined'){
      var piece_index = parent_pos_item.indexOf(piece_id);
      if (piece_index > -1) {
        parent_pos_item.splice(piece_index, 1);
      }

      if( parent_pos_item.length > 0 ){
        var parent_piece_id     = parent_pos_item[0];
        var parent_piece_split  = parent_piece_id.split('-');
        var parent_piece_color  = parent_piece_split[0];

        var piece_img_html = '<img src="assets/images/piece-'+parent_piece_color+'.png" id="'+parent_piece_id+'" class="piece_img" style="height: 30px; padding: 3px 0 0 8px;">';
        document.getElementById(parent_pos).innerHTML = piece_img_html;

        //++++++++++++++++++++++ Add click event to the piece image :: Start ++++++++++++++++++++++//
        this.elRef.nativeElement.querySelector('#'+parent_piece_id).addEventListener('click', (event) => this.move_the_piece(event));
        //++++++++++++++++++++++ Add click event to the piece image :: End ++++++++++++++++++++++//
      }
      else{
        document.getElementById(parent_pos).innerHTML = '';
      }

      console.log(parent_pos_item.length);
    }
    //+++++++++++++++++++ BEGIN :: End +++++++++++++++++++//

    //+++++++++++++++++++ DESTINATION :: Start +++++++++++++++++++//
    var dest_array:any[] = [piece_id];

    this.delete_by_value(destination_pos, piece_id, dest_array);

    var add_piece_arr:any[] = dest_array.toString().split(',');
    this.piece_pos_arr[destination_pos] = add_piece_arr;
    //+++++++++++++++++++ DESTINATION :: End +++++++++++++++++++//

    console.log(this.piece_pos_arr);
  }

  move_the_piece(event){
    if( this.dice_result > 0 ){
      var target = event.target || event.srcElement || event.currentTarget;
      var idAttr = target.attributes.id;
      var piece_id = idAttr.nodeValue;

      if(piece_id != ''){
        var piece_split = piece_id.split('-');

        var piece_color = piece_split[0];
        var piece_number = piece_split[1];
      }

      var parent_id = event.target.parentNode.id;

      //############################# IF DICE 6 :: Start #############################//
      if( (parent_id == (piece_color+'-home-'+piece_number)) && (this.dice_result == 6) ){

        var starting_pos_id = document.getElementsByClassName(piece_color.charAt(0)+'-start')[0].id;
        var starting_pos_split = starting_pos_id.split('-');
        var starting_pos = starting_pos_split[1];

        var moved_pos = parseInt(starting_pos);
        this.clickable = true;

        const destination_pos = 'pos-' + moved_pos;

        var piece_img_html = '<img src="assets/images/piece-'+piece_color+'.png" id="'+piece_id+'" class="piece_img" style="height: 30px; padding: 3px 0 0 8px;">';

        //--------------------------------------------------------//
        this.piece_positions(parent_id, destination_pos, piece_id);
        //--------------------------------------------------------//

        document.getElementById(parent_id).innerHTML = '';
        document.getElementById(destination_pos).innerHTML = piece_img_html;

        //++++++++++++++++++++++ Add click event to the piece image :: Start ++++++++++++++++++++++//
        this.elRef.nativeElement.querySelector('#'+piece_id).addEventListener('click', (event) => this.move_the_piece(event));
        //++++++++++++++++++++++ Add click event to the piece image :: End ++++++++++++++++++++++//

        this.dice_result = 0;

        document.getElementById('dice_result').innerHTML = '<img src="assets/images/dice-set.png" style="width: 120px;">';
      }
      //############################# IF DICE 6 :: End #############################//

      //############################# IF DICE < 6 :: Start #############################//
      else{
        var starting_pos_split:string[] = parent_id.split('-');
        var starting_pos = starting_pos_split[1];

        var moved_pos = parseInt(starting_pos) + this.dice_result;

        //--------------------------------------------------------------------------------------//
        var first_char  = piece_color.charAt(0);
        var ending_pos_id = document.getElementsByClassName(first_char+'-end')[0].id;
        var ending_pos_split:string[] = ending_pos_id.split('-');
        var ending_pos = ending_pos_split[1];
        //--------------------------------------------------------------------------------------//

        const piece_home_array = Array(first_char + 'h-1', first_char + 'h-2', first_char + 'h-3', first_char + 'h-4', first_char + 'h-5');

        if( (piece_home_array.indexOf(parent_id) < 0) && (parseInt(starting_pos) <= parseInt(ending_pos)) && (moved_pos > parseInt(ending_pos)) ){
          moved_pos = moved_pos - parseInt(ending_pos);

          var destination_pos = first_char + 'h-' + moved_pos;
          this.clickable = true;

          if( (parseInt(starting_pos) == parseInt(ending_pos)) && (moved_pos == 6) ){
            destination_pos = first_char + 'done-' + piece_number;
            this.clickable = false;
          }
        }
        else if( piece_home_array.indexOf(parent_id) >= 0 ){

          if(moved_pos == 6){
            var destination_pos = first_char + 'done-' + piece_number;
            this.clickable = false;
          }
          else if(moved_pos < 6){
            var destination_pos = first_char + 'h-' + moved_pos;
            this.clickable = true;
          }
          else{
            return false;
          }
        }
        else if( moved_pos > 52 ){
          moved_pos = moved_pos - 52;
          var destination_pos = 'pos-' + moved_pos;
          this.clickable = true;
        }
        else{
          var destination_pos = 'pos-' + moved_pos;
          this.clickable = true;
        }

        var piece_img_html = '<img src="assets/images/piece-'+piece_color+'.png" id="'+piece_id+'" class="piece_img" style="height: 30px; padding: 3px 0 0 8px;">';

        //--------------------------------------------------------//
        this.piece_positions(parent_id, destination_pos, piece_id);
        //--------------------------------------------------------//

        //document.getElementById(parent_id).innerHTML = '';
        document.getElementById(destination_pos).innerHTML = piece_img_html;

        //++++++++++++++++++++++ Add click event to the piece image :: Start ++++++++++++++++++++++//
        if(this.clickable){
          this.elRef.nativeElement.querySelector('#'+piece_id).addEventListener('click', (event) => this.move_the_piece(event));
        }
        //++++++++++++++++++++++ Add click event to the piece image :: End ++++++++++++++++++++++//

        this.dice_result = 0;

        document.getElementById('dice_result').innerHTML = '<img src="assets/images/dice-set.png" style="width: 120px;">';
      }
      //############################# IF DICE < 6 :: End #############################//
    }
    else{
      return false;
    }
  }

}
