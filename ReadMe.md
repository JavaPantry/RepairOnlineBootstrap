Tomcat server
http://10.125.18.22:8080/RepairOnlineStatic2/


copied to eclipse workspace: c:\STS-3.8.1.Workspace_2017\RepairOnlineStatic2\
moved to WebStorm workspace: c:\WebStormWS\euo_pre-migration.HTML.TEST\

bootstrap code copied from c:\WebStormWS\Angular2Workspace\ExtendingBootstrap\node_modules\bootstrap\dist\css\

# Datapicker review
[Find the best Date and Time Picker to work nice with any screen size article](https://themekraft.com/find-the-best-date-and-time-picker-to-work-nice-with-any-screen-size/)

## Mobile detection native date picker
Use native date picker if android or iPhone detected (this is simply an add-on for https://github.com/eternicode/bootstrap-datepicker )
[bootstrap-datepicker-mobile use native date picker](http://niftylettuce.com/bootstrap-datepicker-mobile/)
[GitHub for it ](https://github.com/niftylettuce/bootstrap-datepicker-mobile/blob/master/bower.json)
to install: >C:\WebStormWS\RepairOnlineBootstrap>bower install -S bootstrap-datepicker-mobile

> Switch to newer version bootstrap-datepicker v. 1.6.4 (original bootstrap-datepicker-mobile refers v.1.3.0)
> to install: >C:\WebStormWS\RepairOnlineBootstrap>npm install bootstrap-datepicker@1.6.4 -save
>   1. This will save module in node_modules
>   2. Switch to new bootstrap-datepicker in index.html
> [gitHub with readme and references](https://github.com/uxsolutions/bootstrap-datepicker)
> [doc & samples](https://bootstrap-datepicker.readthedocs.io/en/stable/markup.html#input)

## not tested i.e. not visited
[Bootstrap 3 Datepicker v4 Docs](http://eonasdan.github.io/bootstrap-datetimepicker/)
[Bootstrap form component DateTime Picker](http://www.malot.fr/bootstrap-datetimepicker/)

#Validate input with bootstrap & jQuery
[start Stackoverflow](http://stackoverflow.com/questions/18296267/form-validation-with-bootstrap-jquery)

> [validation on this tutorial :](http://twitterbootstrap.org/bootstrap-form-validation)

## jQuery validation plugin

- [npm repo](https://www.npmjs.com/package/jquery-validation)
- run `C:\WebStormWS\RepairOnlineBootstrap>npm install jquery-validation -save`


# Buttons
Canon red button custom button wizard:
http://cssgradientbutton.com/?bg0=F62B2B&bg1=D20202&bg2=E40A0A&bg3=9F0202&r=0&p_top=10&p_right=10&p_bottom=10&p_left=10&w_auto=yes&w=150&text_c=FFFFFF&textshadow=yes&textshadow_c=000000&shadow_bt=0&shadow_c=BEBFBF&border_s=1&border_c=819BCB&border_c_hover=819BCB&f_size_auto=no&f_s=12&font=arial,%20helvetica,%20sans-serif&bold=yes&inset=no&s_x=0&s_y=0&s_b=0&t_s_px=-1&b_top=0&b_right=0&b_bottom=6&b_left=0&bt_c=819BCB&br_c=819BCB&bb_c=FF8585&bl_c=819BCB&bhover_top=0&bhover_right=0&bhover_bottom=6&bhover_left=0&bhover_t_c=819BCB&bhover_r_c=819BCB&bhover_b_c=F53D68&bhover_l_c=819BCB&bh_top=0&br_top=0&br_right=0&br_bottom=0&br_left=0&h_s=-1&v_s=-1&b_s=0&o_s=0.3#
---------------------------------------------------------------------------------------------------------------------------------------------------------
Wizard step buttons customization link:
RED: http://cssgradientbutton.com/?bg0=DB0435&bg1=6D0019&bg2=AD032A&bg3=3A000D&r=3&p_top=2&p_right=4&p_bottom=2&p_left=4&w_auto=yes&w=192&text_c=FFFFFF&textshadow=yes&textshadow_c=000000&shadow_bt=0&shadow_c=FFFFFF&border_s=1&border_c=77021D&border_c_hover=77021D&f_size_auto=no&f_s=8&font=arial, helvetica, sans-serif&bold=yes&inset=yes&s_x=0&s_y=0&s_b=1&t_s_px=1&b_top=1&b_right=1&b_bottom=1&b_left=1&bt_c=77021D&br_c=77021D&bb_c=77021D&bl_c=77021D&bhover_top=1&bhover_right=1&bhover_bottom=1&bhover_left=1&bhover_t_c=77021D&bhover_r_c=77021D&bhover_b_c=77021D&bhover_l_c=77021D&bh_top=1&br_top=3&br_right=3&br_bottom=3&br_left=3&h_s=0&v_s=2&b_s=0&o_s=0.5

.wizard_stepOn{
border:1px solid #77021D;-webkit-box-shadow: #FFFFFF 0px 0px 1px inset;-moz-box-shadow: #FFFFFF 0px 0px 1px inset; box-shadow: #FFFFFF 0px 0px 1px inset; -webkit-border-radius: 3px; -moz-border-radius: 3px;border-radius: 3px;font-size:8px;font-family:arial, helvetica, sans-serif; padding: 2px 4px 2px 4px; text-decoration:none; display:inline-block;text-shadow: 0px 2px 0 rgba(0,0,0,0.5);font-weight:bold; color: #FFFFFF;
 background-color: #DB0435; background-image: -webkit-gradient(linear, left top, left bottom, from(#DB0435), to(#6D0019));
 background-image: -webkit-linear-gradient(top, #DB0435, #6D0019);
 background-image: -moz-linear-gradient(top, #DB0435, #6D0019);
 background-image: -ms-linear-gradient(top, #DB0435, #6D0019);
 background-image: -o-linear-gradient(top, #DB0435, #6D0019);
 background-image: linear-gradient(to bottom, #DB0435, #6D0019);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#DB0435, endColorstr=#6D0019);
}

.wizard_stepOn:hover{
 border:1px solid #77021D;
 background-color: #AD032A; background-image: -webkit-gradient(linear, left top, left bottom, from(#AD032A), to(#3A000D));
 background-image: -webkit-linear-gradient(top, #AD032A, #3A000D);
 background-image: -moz-linear-gradient(top, #AD032A, #3A000D);
 background-image: -ms-linear-gradient(top, #AD032A, #3A000D);
 background-image: -o-linear-gradient(top, #AD032A, #3A000D);
 background-image: linear-gradient(to bottom, #AD032A, #3A000D);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#AD032A, endColorstr=#3A000D);
}


Wizard step buttons customization link:
GRAY: http://cssgradientbutton.com/?bg0=E6E6E6&bg1=CCCCCC&bg2=cdcdcd&bg3=b3b3b3&r=3&p_top=2&p_right=4&p_bottom=2&p_left=4&w_auto=yes&w=192&text_c=000000&textshadow=no&textshadow_c=000000&shadow_bt=0&shadow_c=FFFFFF&border_s=1&border_c=77021D&border_c_hover=77021D&f_size_auto=no&f_s=8&font=arial, helvetica, sans-serif&bold=yes&inset=yes&s_x=0&s_y=0&s_b=1&t_s_px=1&b_top=1&b_right=1&b_bottom=1&b_left=1&bt_c=77021D&br_c=77021D&bb_c=77021D&bl_c=77021D&bhover_top=1&bhover_right=1&bhover_bottom=1&bhover_left=1&bhover_t_c=77021D&bhover_r_c=77021D&bhover_b_c=77021D&bhover_l_c=77021D&bh_top=1&br_top=3&br_right=3&br_bottom=3&br_left=3&h_s=0&v_s=2&b_s=0&o_s=0.5

.wizard_stepOff{
border:1px solid #77021D;-webkit-box-shadow: #FFFFFF 0px 0px 1px inset;-moz-box-shadow: #FFFFFF 0px 0px 1px inset; box-shadow: #FFFFFF 0px 0px 1px inset; -webkit-border-radius: 3px; -moz-border-radius: 3px;border-radius: 3px;font-size:8px;font-family:arial, helvetica, sans-serif; padding: 2px 4px 2px 4px; text-decoration:none; display:inline-block;font-weight:bold; color: #000000;
 background-color: #E6E6E6; background-image: -webkit-gradient(linear, left top, left bottom, from(#E6E6E6), to(#CCCCCC));
 background-image: -webkit-linear-gradient(top, #E6E6E6, #CCCCCC);
 background-image: -moz-linear-gradient(top, #E6E6E6, #CCCCCC);
 background-image: -ms-linear-gradient(top, #E6E6E6, #CCCCCC);
 background-image: -o-linear-gradient(top, #E6E6E6, #CCCCCC);
 background-image: linear-gradient(to bottom, #E6E6E6, #CCCCCC);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#E6E6E6, endColorstr=#CCCCCC);
}

.wizard_stepOff:hover{
 border:1px solid #77021D;
 background-color: #cdcdcd; background-image: -webkit-gradient(linear, left top, left bottom, from(#cdcdcd), to(#b3b3b3));
 background-image: -webkit-linear-gradient(top, #cdcdcd, #b3b3b3);
 background-image: -moz-linear-gradient(top, #cdcdcd, #b3b3b3);
 background-image: -ms-linear-gradient(top, #cdcdcd, #b3b3b3);
 background-image: -o-linear-gradient(top, #cdcdcd, #b3b3b3);
 background-image: linear-gradient(to bottom, #cdcdcd, #b3b3b3);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#cdcdcd, endColorstr=#b3b3b3);
}