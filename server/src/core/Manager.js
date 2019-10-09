import settings from "../configs/settings";
import ObjectPool from "shared/core/ObjectsPool";

class Manager {
    constructor({ network, entity, emitRule, type = 'OBJECTS' }) {
        this.network = network;
        this.entity = entity;
        this.emitRule = emitRule;
        this.type = type;

        this.objects = new ObjectPool({ type: this.type });
        this.managers = {};
        this.controller = null;
        this.isEnvironment = false;

    this.subscribe();

    this.update = this.update.bind(this);
  }

  init(controller) {
    this.connectController(controller);
  }

  selector(objectParams) {
    return {
      id: objectParams.id
    };
  }

  addObject(objectParams) {
    objectParams.id = objectParams.id || this.objects.uniqueId;
    const object = new this.entity(this.selector(objectParams));

    if (this.objects.add(object.id, object)) {
      object.init();
    }
  }

  get dataset() {
    let result = {};

    for (let entity of this.objects.values) {
      result[entity.id] = entity.clientData;
    }

    return result;
  }

  getDatasetInRadiusFromPoint(x, y) {
    let result = {};

    for (let entity of this.objects.values) {
      const a = x - entity.x;
      const b = y - entity.y;

      const c = Math.sqrt(a * a + b * b);

      if (c < settings.viewRadius) {
        result[entity.id] = entity.clientData;
      }
    }

    return result;
  }

  subscribe() {
    /* */
  }

  connectController(controller) {
    this.controller = controller;
  }

  connectCollider(collider) {
    this.collider = collider;
  }

  connectManager(name, manager) {
    this.managers[name] = manager;
  }

  update(dt) {
    for (let object of this.objects.values) {
      object.update(dt);
    }
  }
}

export default Manager;
