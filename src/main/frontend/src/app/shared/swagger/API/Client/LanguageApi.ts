
// tslint:disable:no-unused-variable member-ordering
// noinspection ES6UnusedImports




import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ClassProvider, FactoryProvider, Inject, Injectable, InjectionToken, Optional, Provider} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {classToPlain, plainToClass} from 'class-transformer';
import * as moment from 'moment';
import * as R from 'ramda';
import {Observable} from 'rxjs/Observable';
import {IScheduler} from 'rxjs/Scheduler';
import {delay, map} from 'rxjs/operators';

import {isValidValue, selectHeaderContentType, selectHeaderAccept, setHeader} from '../api.helper';
import {BASE_PATH, COLLECTION_FORMATS} from '../variables';
import {Configuration} from '../configuration';
import {ClassType} from '../classType';
import {createHttpEffect} from '../http.effect';
import {createGlobalBlockerEffect} from '../global-blocker.effect';
import {createNotificationEffect} from '../notification.effect';
import {HttpActions} from '../http.actions';
import {HttpActionsArgs} from '../http.model';
import {CustomHttpUrlEncodingCodec} from '../query-encoder';
import {Api$FactoryConfig, Api$FactoryConfig2, Api$FactoryConfig3} from '../api-factory.model';
import {apiFactory$} from '../api-factory';
import {argsObj} from '../../helpers/gp/args-obj';


export module LanguageApi {

export abstract class Api {

   /**
    * View a list of available languages
    * 
    */
    abstract getLanguages(): Observable<>;

}

@Injectable()
class Service extends Api {
    private defaultHeaders = new HttpHeaders();

    constructor(private readonly httpClient: HttpClient,
                @Inject(BASE_PATH) private readonly basePath: string,
                @Optional() private readonly configuration: Configuration) {
      super();
      if (!this.configuration) {
        this.configuration = {};
      }
    }

    /**
     * View a list of available languages
     * 
     */
    public getLanguages(): Observable<> {

        let headers = this.defaultHeaders;

        headers = setHeader('Accept', selectHeaderAccept(['application/json']), headers);


        return this.httpClient.request<>(
          'GET',
          `${this.basePath}/api/languages`,
          {
             headers: headers,
             observe: 'body',
             reportProgress: false
           }
        );
    }

}

export const provider: Provider = <ClassProvider> {
    provide: Api,
    useClass: Service
};

export module getLanguages {

    // noinspection TsLint
    export interface Type extends HttpActionsArgs {
    }



    export const actions = new HttpActions<Type, Iterable>('ILanguageApi.getLanguages');

    @Injectable()
    export class ApiEffect {

      @Effect() effect;
      constructor(private api: Api,
                  private actions$: Actions) {

        this.effect = Observable.merge(
          // http action
          createHttpEffect(actions$,
            actions,
            (args: Type) => {
                const data: any = Object.assign({}, args);

                return api.getLanguages();
                }),
          // notification actions
          createNotificationEffect(actions$, actions),
          // global blocker actions
          createGlobalBlockerEffect(actions$, actions)
        );
      }
    }



}


}
