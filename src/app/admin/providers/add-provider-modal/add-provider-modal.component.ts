import { Component, Output, EventEmitter, OnInit, } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProviderModel } from 'src/app/shared/models/provider.model';
import { ProviderService } from 'src/app/admin/__services__/providers.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';
import { SlackService } from '../../__services__/slack.service';
import { IChannel } from 'src/app/shared/models/channel.model';

@Component({
  templateUrl: './add-provider-modal.component.html',
  styleUrls: [
    './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss',
    './add-provider-modal.component.scss',
  ]
})

export class AddProviderModalComponent implements OnInit {
  providerData: ProviderModel;
  loading: boolean;
  isDirectMessage: boolean;
  channelId: string;
  channels: IChannel[] = [];
  @Output() executeFunction = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AddProviderModalComponent>,
    public providerService: ProviderService,
    public alert: AlertService,
    private appEventService: AppEventService,
    public slackService: SlackService
  ) {
    this.providerData = new ProviderModel('', '');
  }

  ngOnInit() {
    this.isDirectMessage = true;
    this.loadChannels();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  logError(error) {
    if (error && error.status === 404) {
      this.alert.error('Provider user email entered does not exist');
    } else if (error && error.status === 409) {
      const { error: { message } } = error;
      this.alert.error(message);
    } else {
      this.alert.error('Something went wrong, please try again');
    }
  }

  addProvider(): void {
    this.loading = true;
    const providerData = {
      ...this.providerData,
      isDirectMessage: this.isDirectMessage,
      channelId: this.channelId,
    };
    this.providerService.add(providerData).subscribe(
      (responseData) => {
        if (responseData.success) {
          this.alert.success(responseData.message);
          this.appEventService.broadcast({ name: 'newProvider' });
          this.loading = false;
          this.dialogRef.close();
        }
      },
      (error) => {
        this.logError(error);
        this.loading = false;
      }
    );
  }

  loadChannels() {
    this.slackService.getChannels().subscribe((response) => {
      if (response.success) {
        this.channels = response.data;
      }
    });
  }

  toggleNotification(value: string) {
    if (value === 'isDirectMessage') {
      this.isDirectMessage = true;
      this.channelId = null;
    } else {
      this.isDirectMessage = false;
      this.channelId = value;
    }
  }
}
