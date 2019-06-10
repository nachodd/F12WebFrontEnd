<template>
  <q-tab-panel v-if="tabAccionesAsignarReqs" name="accionesAsignarReqs">
    <div class="text-grey-7">
      Seleccione una acción:
    </div>

    <q-select
      v-model="operationAsignar"
      filled
      :options="optionsAsignar"
      options-cover
      emit-value
      map-options
    />

    <div class="q-mt-md">
      <!-- coemntario para cuando asigna -->
      <q-slide-transition>
        <div v-show="operationAsignar === 'asignar'" class="row">
          <div class="col-12">
            <q-select
              v-model="usuarioAsignado"
              filled
              :options="asignacionUsuarios"
              options-cover
              emit-value
              map-options
            />
          </div>

          <div class="col-12">
            <q-input
              ref="commentAsignar"
              v-model="comment"
              color="accent"
              outlined
              autogrow
              label="Agregar un comentario:"
              :hide-bottom-space="true"
              :rules="[notEmpty]"
            />
          </div>
        </div>
      </q-slide-transition>
    </div>
  </q-tab-panel>
</template>
