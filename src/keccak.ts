/**
 * Returns a Keccak permutation function with state and accessible properties.
 * @param {number} b - The bit width of the permutation.
 * @param {numer} n - The number of applications of the round function per permutation.
 * @returns {(() => void) & { b:number, B:number, S:Uint8Array<ArrayBufferLike> }}
 * A Keccak permutation function with the following accessible properties:
 * - `b` - The width in bits of the permutation.
 * - `B` - The width in bytes of the permutation.
 * - `S` - The "current" state of the permutation function.
 */
function keccak_p(b:number, n:number):((() => void)&{ b:number, B:number, S:Uint8Array<ArrayBufferLike> }) {

    const B = b >> 3;
    const W = B / 25;
	const C = new Uint8Array(5 * W);
    const D = new Uint8Array(5 * W);
    const _e0_ = [new Uint8Array(25 * W), new Uint8Array(25 * W)];
    let _e1_ = 0;
    
    /**
     * Return the "current" Keccak state.
     * @returns {Uint8Array} The "read" Keccak state.
     */
	function _e2_():Uint8Array {
        return _e0_[_e1_]!;
    }

    /**
     * Return the "non-current" Keccak state.
     * @returns {Uint8Array} The Keccak state.
     */
	function _e3_():Uint8Array {
        return _e0_[_e1_ ^ 1]!;
    }

    /**
     * Execute the theta step mapping.
     */
	function theta() {
		for (let x = 0; x < 5; x++)
		for (let z = 0; z < W; z++)
			C[x * W + z] =
				  _e2_()[5 * W * 0 + W * x + z]!
				^ _e2_()[5 * W * 1 + W * x + z]!
				^ _e2_()[5 * W * 2 + W * x + z]!
				^ _e2_()[5 * W * 3 + W * x + z]!
				^ _e2_()[5 * W * 4 + W * x + z]!;
		for (let x = 0; x < 5; x++)
		for (let z = 0; z < W; z++)
			D[x * W + z] =
				  C[W * ((x + 4) % 5) + z]!
				^ (C[W * ((x + 1) % 5) + z]! << 1 & 0xff)
				^ (C[W * ((x + 1) % 5) + (z + W - 1) % W]! >> 7);
		for (let y = 0; y < 5; y++)
		for (let x = 0; x < 5; x++)
		for (let z = 0; z < W; z++)
			_e3_()[5 * W * y + W *  x + z] =
				  _e2_()[5 * W * y + W * x + z]!
				^ D[W * x + z]!;
		_e1_ ^= 1;
	}

    
    /**
     * Execute the rho step mapping.
     */
	function rho() {
		for (let z = 0; z < W; z++)
			_e3_()[5 * W * 2 + W * 2 + z] = _e2_()[5 * W * 2 + W * 2 + z]!;
		let x = 3;
		let y = 2;
		for (let t = 0; t < 24; t++) {
			const _85_ = (t + 1) * (t + 2) >> 1;
			const _c8_ = _85_ >> 3;
			const _5b_ = _85_ & 7;
			for (let z = 0; z < W; z++) {
				const _95_ = (z + W - _c8_ % W) % W;
				const _e9_ = _e2_()[5 * W * y + W * x + _95_]! << _5b_ & 0xff;
                const _34_ = (_95_ + W - 1) % W;
				const _3f_ = _e2_()[5 * W * y + W * x + _34_]! >> 8 - _5b_;
				const _37_ = _e9_ | _3f_;
				_e3_()[5 * W * y + W * x + z] = _37_;
			}
			const a = x;
			x = y;
			y = (2 * (a + 3) + 3 * (y + 3) + 2) % 5;
		}
		_e1_ ^= 1;
	}

        /**
     * Execute the pi step mapping.
     */
	function pi() {
		for (let y = 0; y < 5; y++)
		for (let x = 0; x < 5; x++)
		for (let z = 0; z < W; z++)
			_e3_()[5 * W * y + W * x + z] =
				_e2_()[5 * W * x + W * ((3 * (y + 3) + x + 3 + 2) % 5) + z]!;
		_e1_ ^= 1;
	}

    /**
     * Execute the chi step mapping.
     */
	function chi() {
		for (let y = 0; y < 5; y++)
		for (let x = 0; x < 5; x++)
		for (let z = 0; z < W; z++)
			_e3_()[5 * W * y + W * x + z] =
				  _e2_()[5 * W * y + W * x + z]!
				^ (0xff ^ _e2_()[5 * W * y + W * ((x + 1) % 5) + z]!) 
				& _e2_()[5 * W * y + W * ((x + 2) % 5) + z]!;
		_e1_ ^= 1;
	}

    /**
     * A linear feedback shift register based function for calculating the round constant.
     * @param {number} t - A numeric parameter generated within the iota step mapping.
     */
	function rc(t:number) {
		if (t == 0) return 1;
		let a = 0x80;
		for (let s = 1; s < t; s++)
			a = (
				a
				^ (a << 8 & 0x100)
				^ (a << 4 & 0x010)
				^ (a << 3 & 0x008)
				^ (a << 2 & 0x004)
			) >> 1 & 0xff;
		return a & 1;
	}

    /**
     * Execute the iota step mapping.
     * @param {number} i - The round index.
     */
	function iota(i:number) {
		for (let y = 0; y < 5; y++)
		for (let x = 0; x < 5; x++)
		for (let z = 0; z < W; z++)
			_e3_()[5 * W * y + W * x + z] = _e2_()[5 * W * y + W * x + z]!;
		for (let j = 0; j < Math.log2(W << 3) + 1; j++)
			_e3_()[5 * W * 2 + W * 2 + ((1 << j) - 1 >> 3)]! ^=
				rc(j + 7 * i) << (((1 << j) - 1) & 7);
		_e1_ ^= 1;
	}

    /**
     * Execute a round of step mappings.
     * @param {number} i - The round index.
     */
	function round(i:number) {
		theta();
		rho();
		pi();
		chi();
		iota(i);
	}

	return Object.assign(function():void {
		for (let i = 0; i < B; i++)
			_e3_()[5 * W * ((Math.floor(i / W / 5) + 2) % 5) + W * ((Math.floor(i / W) + 2) % 5) + i % W] = _e2_()[i]!;
        _e1_ ^= 1;
		for (let i = 12 + 2 * Math.log2(W << 3) - n; i < 12 + 2 * Math.log2(W << 3); i++)
			round(i);
		for (let i = 0; i < B; i++)
			_e3_()[i] = _e2_()[5 * W * ((Math.floor(i / W / 5) + 2) % 5) + W * ((Math.floor(i / W) + 2) % 5) + i % W]!;
        _e1_ ^= 1;
	}, { b, B, get S() { return _e2_(); } });

}

/**
 * A specialized version of keccak_p where `n` is 12 + 2l (and where `l` is log2 a lane's bit length).
 * @param {number} b - The permutation width.
 * @returns {(() => void) & { b:number, B:number, S:Uint8Array<ArrayBufferLike> }}
 * A Keccak permutation function with the following accessible properties:
 * - `b` - The width in bits of the permutation.
 * - `B` - The width in bytes of the permutation.
 * - `S` - The "current" state of the permutation function.
 */
function keccak_f(b:number):((() => void)&{ b:number, B:number, S:Uint8Array<ArrayBufferLike> }) {
    return keccak_p(b, 12 + 2 * Math.log2(b / 25));
}

/**
 * A helper function that yields sequential chunks of a Uint8Array.
 * @param {Uint8Array} a - The Uint8Array to separate into chunks.
 * @param {number} l - The size of each chunk.
 * @yields {Uint8Array} - A chunk of the Uint8Array.
 */
function* _3d403e_(a:Uint8Array, l:number) {
    for (let start = 0, end = start + l; end <= a.byteLength; start += l, end += l)
        yield a.slice(start, end);
}

/**
 * A higher order function that returns sponge functions with arbitrary output length that can operate on data.
 * @param {{ b:number, B:number, S:Uint8Array } & (() => void)} f 
 * An underlying function that operates on fixed length data.
 * - `b` and `B` are accessible properties of the function respectively representing the permutation width in bits and bytes.
 * - `S` is an accessible getter of the function which returns the functions "current" state.
 * @param {(X:number, M:number, b:number)=>Uint8Array} pad
 * A padding rule which returns a Uint8Array of just the padding portion to apply to data.
 * - `X` is the value representing the length in bytes of data whose next highest multiple is desired through adding padding.
 * - `M` is the length in bytes of the existing data to be padded.
 * - `b` is a "bit offset" if the data is to be interpreted as having a sub-byte bit string appended to it.
 * 
 * For example, if a pre-sponge bit string of `01` is appended to a message to be padded, `b` would be 2, the length of the bit string.
 * @param {number} r - The rate parameter.
 * @returns {(N:Uint8Array, d:number, b:number) => Uint8Array}
 * A sponge function that takes input data `N` and produces output data with length in bits `d`.
 * Parameter `b` is the same as in the `pad` function, denoting the length of a pre-sponge bit string appended to the raw input data.
 */
function sponge(
    f:{ b:number, B:number, S:Uint8Array } & (()=>void),
    pad:(X:number, M:number, b:number)=>Uint8Array,
    r:number
):((N:Uint8Array, d:number, b:number) => Uint8Array) {
    return function(N:Uint8Array, d:number, b:number) {
        const D = d >> 3;
        const R = r >> 3;
        f.S.fill(0);
	    const _f9_ = Math.ceil((N.byteLength + (b == 0 ? 1 : 0)) / R) * R;
		const P = new Uint8Array(_f9_);
		P.set(N);
        if (pad) {
            const _56_ = pad(R, N.byteLength - (b == 0 ? 0 : 1), b);
            for (let i = 0, j = N.byteLength - (b == 0 ? 0 : 1); i < _56_.byteLength; i++, j++)
                P[j]! += _56_[i]!;
        }
		for (let p of _3d403e_(P, R)) {
			for (let i = 0; i < f.B; i++)
				f.S[i]! ^= p[i]!;
			f();
		}
		const _03_ = Math.ceil((D + 1) / R) * R;
		const Z = new Uint8Array(_03_);
		let i = 0; while (true) {
			Z.set(f.S.slice(0, R), i);
			i += R
			if (!(i < D)) break;
			f();
		}
		return Z.slice(0, D);
    };
}

/**
 * The "pad10*1" padding rule.
 * @param {number} X - The value representing the length in bytes of data whose next highest multiple is desired through adding padding.
 * @param {number} M - The length in bytes of the existing data to be padded.
 * @param {number} b - The length of a pre-sponge bit string appended to the raw input data which is to be padded.
 * @returns {Uint8Array} - The padding data to be appended to the message.
 */
function padOneZeroStarOne(X:number, M:number, b:number):Uint8Array {
    const _79_ = new Uint8Array(Math.ceil((M + 1) / X) * X - M);
    _79_[0]! += 1 << b;
    _79_[_79_.byteLength - 1]! += 0x80;
    return _79_;
}

/**
 * A higher order function which returns a sponge function with a keccak-p permutation as the underlying function and pad10*1 as the padding rule.
 * @param {number} c - The `capacity` parameter.
 * @returns {(N:Uint8Array, d:number, b:number) => Uint8Array}
 * A sponge function that takes input data `N` and produces output data with length in bits `d`,
 * where `b` indicates the length of a pre-sponge bit string appended to the raw input data.
 */
function keccak_c(c:number):(N:Uint8Array, d:number, b:number) => Uint8Array {
    return sponge(keccak_p(1600, 24), padOneZeroStarOne, 1600 - c);
}

/**
 * A higher order function which applies pre-sponge padding to data, then applies a keccak-c sponge function, then returns output data.
 * @param {(c:number)=>(N:Uint8Array, D:number, b:number)=>Uint8Array} k - A higher order keccak-c sponge function generator.
 * @param {c} c - The `capacity` parameter in bits with which to generate the keccak-c sponge function.
 * Also determines the output data length (length = c / 2).
 * @param {n} n - The pre-sponge bit string to pad the data with.
 * @param {b} b - The length of the pre-sponge bit string that will pad input data.
 * @returns {(M:Uint8Array) => Uint8Array} A function which will permute input data and return output data.
 */
function sha_3(k:(c:number)=>(N:Uint8Array, D:number, b:number)=>Uint8Array, c:number, n:null|number, b:number):(M:Uint8Array) => Uint8Array {
    const keccak = k(c);
    return function(M:Uint8Array) {
        const _a9_ = new Uint8Array(M.byteLength + (b == 0 ? 0 : 1));
        _a9_.set(M);
        if (b !== 0) _a9_[_a9_.byteLength - 1] = n!;
        const d = c >> 1;
        return keccak(_a9_, d, b);
    }
}

/**
 * A higher order function which applies pre-sponge padding to data, then applies a keccak-c sponge function, then returns variable length output data.
 * @param {(c:number)=>(N:Uint8Array, D:number, b:number)=>Uint8Array} k - A higher order keccak-c sponge function generator.
 * @param {c} c - The `capacity` parameter in bits with which to generate the keccak-c sponge function.
 * Also determines the output data length (length = c / 2).
 * @param {n} n - The pre-sponge bit string to pad the data with.
 * @param {b} b - The length of the pre-sponge bit string that will pad input data.
 * @returns {(M:Uint8Array, D:number) => Uint8Array} A function which will permute input data and return output data.
 * `D` indicates the desired amount of output bytes
 */
function sha_3_xof(k:(c:number)=>(N:Uint8Array, D:number, b:number)=>Uint8Array, c:number, n:number, b:number):(M:Uint8Array, d:number) => Uint8Array {
    const keccak = k(c);
    return function(M:Uint8Array, D:number) {
        const _a9_ = new Uint8Array(M.byteLength + (b == 0 ? 0 : 1));
        _a9_.set(M);
        if (b != 0) _a9_[_a9_.byteLength - 1] = n;
        const d = D << 3;
        return keccak(_a9_, d, b);
    }
}

export { keccak_p, keccak_f, keccak_c, sha_3, sha_3_xof };