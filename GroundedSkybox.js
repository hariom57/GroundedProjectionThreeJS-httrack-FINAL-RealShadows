import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';

/**
 * A 'ground-projected' skybox. Custom mesh/custom class
 *
 * By default the object is centered at the camera, so it is often helpful to set
 * `skybox.position.y = height` to put the ground at the origin.
 *
 * ```
 * const height = 15, radius = 100;
 *
 * const skybox = new GroundedSkybox( envMap, height, radius );
 * skybox.position.y = height;
 * scene.add( skybox );
 * ```
 *
 * @augments Mesh
 * @three_import import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
 */
class GroundedSkybox extends Mesh {

    /**
     * Constructs a new ground-projected skybox.
     *
     * @param {Texture} map - The environment map to use.
     * @param {number} height - The height is how far the camera that took the photo was above the ground.
     * A larger value will magnify the downward part of the image.
     * @param {number} radius - The radius of the skybox. Must be large enough to ensure the scene's camera stays inside.
     * @param {number} [resolution=128] - The geometry resolution of the skybox.
     */
    constructor(map, height, radius, resolution = 128) {

        if (height <= 0 || radius <= 0 || resolution <= 0) {
            throw new Error('GroundedSkybox height, radius, and resolution must be positive.');
        }

        // Store parameters for later updates
        super(GroundedSkybox._createGeometry(height, radius, resolution), new MeshBasicMaterial({ map, depthWrite: false }));

        this._map = map;
        this._height = height;
        this._radius = radius;
        this._resolution = resolution;
    }

    // Static helper to create geometry
    static _createGeometry(height, radius, resolution) {
        const geometry = new SphereGeometry(radius, 2 * resolution, resolution);
        geometry.scale(1, 1, -1);

        const pos = geometry.getAttribute('position');
        const tmp = new Vector3();

        for (let i = 0; i < pos.count; ++i) {
            tmp.fromBufferAttribute(pos, i);
            if (tmp.y < 0) {
                // Smooth out the transition from flat floor to sphere:
                const y1 = -height * 3 / 2;
                const f = tmp.y < y1 ? -height / tmp.y : (1 - tmp.y * tmp.y / (3 * y1 * y1));
                tmp.multiplyScalar(f);
                tmp.toArray(pos.array, 3 * i);
            }
        }

        pos.needsUpdate = true;
        return geometry;
    }

    // --- Dynamic setters for height and radius ---

    set height(value) {
        if (value > 0 && value !== this._height) {
            this._height = value;
            this._updateGeometry();
        }
    }
    get height() {
        return this._height;
    }

    set radius(value) {
        if (value > 0 && value !== this._radius) {
            this._radius = value;
            this._updateGeometry();
        }
    }
    get radius() {
        return this._radius;
    }

    set resolution(value) {
        if (value > 0 && value !== this._resolution) {
            this._resolution = value;
            this._updateGeometry();
        }
    }
    get resolution() {
        return this._resolution;
    }

    // --- Geometry update method ---

    _updateGeometry() {
        this.geometry.dispose();
        this.geometry = GroundedSkybox._createGeometry(this._height, this._radius, this._resolution);
    }
}

export { GroundedSkybox };
