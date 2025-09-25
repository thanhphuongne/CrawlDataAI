import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html'
})
export default class NotiStyleGuideComponent {
  codeDemo = `const successToasts = this.toastr.success(
    "This is notify successfully!",//This is message
    "Successfully",//This is title
    {
      disableTimeOut: true,
      closeButton: true,
    }//Optional
  );
  /* This code for define button*/
  successToasts.toastRef.componentInstance.buttons = [
    {
      id: "1",
      title: "Active",
      type: "filled", // "filled" | "outline" | "subtle" | "text"
      variant: "success",// "primary" | "secondary" | "tertiary"| "success" | "danger" | "warning"
    },
  ];
  /* Action when click to button */
  successToasts.onAction.subscribe((x) => {
    alert("click")//For multi button check x is button object
  });`;
  constructor(private toastr: ToastrService) {}

  showSuccess() {
    this.toastr.success('This is notify successfully!', '', {
      disableTimeOut: true,
      closeButton: true
    });
  }
  showSuccessTitle() {
    const successToasts = this.toastr.success(
      'This is notify successfully!',
      'Successfully',
      {
        disableTimeOut: true,
        closeButton: true
      }
    );
    successToasts.toastRef.componentInstance.buttons = [
      {
        id: '1',
        title: 'Active',
        type: 'filled',
        variant: 'success'
      }
    ];
    successToasts.onAction.subscribe(x => {
      alert('click');
    });
  }
  showError() {
    this.toastr.error('This is notify error!', '', {
      disableTimeOut: true,
      closeButton: true
    });
  }
  showInfo() {
    this.toastr.info('This is notify info!', '', {
      disableTimeOut: true,
      closeButton: true
    });
  }
  showWarning() {
    this.toastr.warning('This is notify warning!', '', {
      disableTimeOut: true,
      closeButton: true
    });
  }
}
